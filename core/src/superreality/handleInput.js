import { formOpinionAboutSpeaker } from "@latitudegames/thoth-core/src/superreality/formOpinionAboutSpeaker.js";
import { summarizeAndStoreFactsAboutAgent } from "@latitudegames/thoth-core/src/superreality/summarizeAndStoreFactsAboutAgent.js";
import { summarizeAndStoreFactsAboutSpeaker } from "@latitudegames/thoth-core/src/superreality/summarizeAndStoreFactsAboutSpeaker.js";
import { makeCompletionRequest } from "@latitudegames/thoth-core/src/superreality/makeCompletionRequest.js";
import { evaluateTextAndRespondIfToxic } from "@latitudegames/thoth-core/src/superreality/profanityFilter.js";
import { database } from '@latitudegames/thoth-core/src/superreality/database';

async function archiveConversation(speaker, agent, _conversation, client, channel) {
        // Get configuration settings for agent
        const { conversationWindowSize } = await getConfigurationSettingsForAgent(agent);

        const conversation = (await database.instance.getConversation(agent, speaker, client, channel, false)).toString().trim();
        const conversationLines = conversation.split('\n');
        if (conversationLines.length > conversationWindowSize) {
                const oldConversationLines = conversationLines.slice(0, Math.max(0, conversationLines.length - conversationWindowSize));
                const newConversationLines = conversationLines.slice(Math.min(conversationLines.length - conversationWindowSize));
                for (let i = 0; i < oldConversationLines.length; i++) {
                        await database.instance.setConversation(agent, client, channel, speaker, oldConversationLines[i], true);
                }
                /*for(let i = 0; i < newConversationLines.length; i++) {
                        await database.instance.setConversation(agent, client, channel, speaker, newConversationLines[i], false);
                }*/
        }
}

async function archiveFacts(speaker, agent) {
        // Get configuration settings for agent
        const { speakerFactsWindowSize, agentFactsWindowSize } = getConfigurationSettingsForAgent(agent);

        const existingSpeakerFacts = (await database.instance.getSpeakersFacts(agent, speaker)).toString().trim().replaceAll('\n\n', '\n');
        log("Existing facts about speaker:", existingSpeakerFacts)
        const speakerFacts = existingSpeakerFacts == "" ? "" : existingSpeakerFacts; // If no facts, don't inject
        const speakerFactsLines = speakerFacts.split('\n');  // Slice the facts and store any more than the window size in the archive
        if (speakerFactsLines.length > speakerFactsWindowSize) {
                database.instance.updateSpeakersFactsArchive(agent, speaker, speakerFactsLines.slice(0, speakerFactsLines.length - speakerFactsWindowSize).join("\n"));
                database.instance.setSpeakersFacts(agent, speaker, speakerFactsLines.slice(speakerFactsLines.length - speakerFactsWindowSize).join("\n"));
        }

        const existingAgentFacts = (await database.instance.getAgentFacts(agent)).toString().trim();
        const agentFacts = existingAgentFacts == "" ? "" : existingAgentFacts + "\n"; // If no facts, don't inject
        const agentFactsLines = agentFacts.split('\n'); // Slice the facts and store any more than the window size in the archive
        if (agentFactsLines.length > agentFactsWindowSize) {
                database.instance.updateAgentFactsArchive(agent, agentFactsLines.slice(0, agentFactsLines.length - agentFactsWindowSize).join("\n"));
                database.instance.setAgentFacts(agent, agentFactsLines.slice(agentFactsLines.length - agentFactsWindowSize).join("\n"));;
        }
}

//generates the context for the open ai request, it gets the default configration from the website and replaces it with the agent's specifics
async function generateContext(speaker, agent, conversation, message) {
        let keywords = []
        if (!isInFastMode) {
                keywords = keywordExtractor(message, agent);
        }

        const pr = await Promise.all([keywords,
                database.instance.getSpeakersFacts(agent, speaker),
                database.instance.getAgentFacts(agent),
                database.instance.getRoom(agent),
                database.instance.getMorals(),
                database.instance.getEthics(agent),
                database.instance.getPersonality(agent),
                database.instance.getNeedsAndMotivations(agent),
                database.instance.getDialogue(agent),
                database.instance.getMonologue(agent),
                database.instance.getFacts(agent)]);

        pr[1] = pr[1].toString().trim().replaceAll('\n\n', '\n');
        pr[2] = pr[2].toString().trim().replaceAll('\n\n', '\n');

        let kdata = '';
        if (!isInFastMode) {
                if (pr[0].length > 0) {
                        kdata = "More context on the chat:\n";
                        for (let k in pr[0]) {
                                kdata += 'Q: ' + capitalizeFirstLetter(pr[0][k].word) + '\nA: ' + pr[0][k].info + '\n\n';
                        }
                        kdata += '\n';
                }
        }

        // Return a complex context (this will be passed to the transformer for completion)
        return (await database.instance.getContext()).toString()
                .replaceAll('$room', pr[3])
                .replaceAll("$morals", pr[4])
                .replaceAll("$ethics", pr[5])
                .replaceAll("$personality", pr[6])
                .replaceAll("$needsAndMotivations", pr[7])
                .replaceAll("$exampleDialog", pr[8])
                .replaceAll("$monologue", pr[9])
                .replaceAll("$facts", pr[10])
                // .replaceAll("$actions", fs.readFileSync(rootAgent + 'actions.txt').toString())
                .replaceAll("$speakerFacts", pr[1])
                .replaceAll("$agentFacts", pr[2])
                .replaceAll('$keywords', kdata)
                .replaceAll("$agent", agent)
                .replaceAll("$speaker", speaker)
                .replaceAll("$conversation", conversation);
}

async function getConfigurationSettingsForAgent(agent) {
        const config = JSON.parse(
                (await database.instance.getAgentsConfig(agent)).toString()
        )
        return config
}


function respondWithMessage(agent, text, res) {
        if (res) res.status(200).send(JSON.stringify({ result: text }));
        console.log(agent + ">>> " + text);
        return text;
}

//handles the commands from the input (terminal, web or any client)
async function evaluateTerminalCommands(message, speaker, agent, res, client, channel) {
        if (message === "/reset") { // If the user types /reset into the console...
                // If there is a response (i.e. this came from a web client, not local terminal)
                if (res) {
                        const result = { result: `${agent} has been reset` };
                        // Add the status 200 message (message OK)
                        res.status(200)
                                // Send the message as JSON
                                .send(JSON.stringify(result));
                }

                await database.instance.clearConversations();
                return true;
        }

        else if (message === "/dump") { // If a user types dump, show them logs of convo
                // Read conversation history
                const conversation = await database.instance.getConversation(agent, speaker, client, channel, false);
                // If there is a response (i.e. this came from a web client, not local terminal)
                const result = { result: conversation };
                if (res) {
                        // Add the status 200 message (message OK)
                        res.status(200)
                                // Send the message as JSON
                                .send(JSON.stringify(result));
                }
                return true;
        }

        else if (message === "GET_AGENT_NAME") {
                if (res) res.status(200).send(JSON.stringify({ result: agent }));
                return true;
        }
}

//handles the input from a client according to a selected agent and responds
export async function handleInput(message, speaker, agent, res, clientName, channelId) {
        let start = Date.now()
        agent = agent ?? defaultAgent

        //if the input is a command, it handles the command and doesn't respond according to the agent
        if (await evaluateTerminalCommands(message, speaker, agent, res, clientName, channelId)) return;

        const _meta = await database.instance.getMeta(agent, speaker);
        if (!_meta || _meta.length <= 0) {
                database.instance.setMeta(agent, speaker, JSON.stringify({ messages: 0 }));
        }

        // Get configuration settings for agent
        const { dialogFrequencyPenality,
                dialogPresencePenality,
                factsUpdateInterval,
                useProfanityFilter } = await getConfigurationSettingsForAgent(agent);

        // If the profanity filter is enabled in the agent's config...
        if (useProfanityFilter) {
                // Evaluate if the speaker's message is toxic
                const { isProfane, isSensitive, response } = await evaluateTextAndRespondIfToxic(speaker, agent, message);
                if ((isProfane || isSensitive) && response) {
                        if (res) res.status(200).send(JSON.stringify({ result: response }));
                        return response;
                }
        }

        // Parse files into objects
        const meta = !_meta || _meta.length <= 0 ? { messages: 0 } : JSON.parse(_meta);
        let conversation = (await database.instance.getConversation(agent, speaker, clientName, channelId, false)).toString().replaceAll('\n\n', '\n');
        conversation += '\n' + speaker + ': ' + message;

        // Increment the agent's conversation count for this speaker
        meta.messages = meta.messages + 1;

        // Archive previous conversation and facts to keep context window small
        archiveConversation(speaker, agent, conversation, clientName, channelId);
        archiveFacts(speaker, agent, conversation);
        let stop = Date.now()
        console.log(`Time Taken to execute load data = ${(stop - start) / 1000} seconds`);
        start = Date.now()

        const context = (await generateContext(speaker, agent, conversation, message)).replaceAll('\n\n', '\n');
        // TODO: Wikipedia?
        stop = Date.now()
        console.log(`Time Taken to execute create context = ${(stop - start) / 1000} seconds`);
        start = Date.now()

        // Create a data object to pass to the transformer API
        const data = {
                "prompt": context,
                "temperature": 0.9, // TODO -- this should be changeable
                "max_tokens": 100, // TODO -- this should be changeable
                "top_p": 1, // TODO -- this should be changeable
                "frequency_penalty": dialogFrequencyPenality,
                "presence_penalty": dialogPresencePenality,
                "stop": ["\"\"\"", `${speaker}:`, '\n']
        };

        // Call the transformer API
        const { success, choice } = await makeCompletionRequest(data, speaker, agent, "conversation");
        stop = Date.now()
        console.log(`Time Taken to execute openai request = ${(stop - start) / 1000} seconds`);
        start = Date.now()
        database.instance.setConversation(agent, clientName, channelId, speaker, message, false);
        // If it fails, tell speaker they had an error
        if (!success) {
                const error = "Sorry, I had an error";
                return respondWithMessage(agent, error, res);
        };
        if (useProfanityFilter) {

                // Check agent isn't about to say something offensive
                const { isProfane, response } = await evaluateTextAndRespondIfToxic(speaker, agent, choice.text, true);

                if (isProfane) {
                        database.instance.setConversation(agent, clientName, channelId, agent, response, false);
                        return respondWithMessage(agent, response, res);
                }
        }

        //every some messages it gets the facts for the user and the agent
        if (meta.messages % factsUpdateInterval == 0) {

                const conversation = (await database.instance.getConversation(agent, speaker, clientName, channelId, false)).toString().trim();
                const conversationLines = conversation.split('\n');

                const updatedConversationLines = conversationLines.filter(line => line != "" && line != "\n").slice(conversationLines.length - factsUpdateInterval * 2).join("\n");
                console.log("Forming an opinion about speaker")
                formOpinionAboutSpeaker(speaker, agent, updatedConversationLines);
                console.log("Formed an opinion about speaker")

                summarizeAndStoreFactsAboutSpeaker(speaker, agent, updatedConversationLines);
                summarizeAndStoreFactsAboutAgent(speaker, agent, updatedConversationLines + choice.text);
        }

        database.instance.setMeta(agent, speaker, meta);

        let response = choice.text.split('\n')[0];

        // Write to conversation to the database
        database.instance.setConversation(agent, clientName, channelId, agent, response, false);
        console.log("responding with message", response);
        stop = Date.now()
        console.log(`Time Taken to execute save data = ${(stop - start) / 1000} seconds`);
        return respondWithMessage(agent, response, res);
}
