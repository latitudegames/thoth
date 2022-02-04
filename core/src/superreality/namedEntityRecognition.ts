import { makeModelRequest } from "./makeModelRequest";

//Named Entity Recognition (NER) is used to detect the entity type of an object
export async function namedEntityRecognition(data) {
    const result = await makeModelRequest(data, "dslim/bert-large-NER");
    if (result && result.length > 0) {
        if (result[0].entity_group === 'PER') {
            return 'Alive Object';
        } else {
            return 'Location';
        }
    }
    else {
        return 'Not Alive Object';
    }
}