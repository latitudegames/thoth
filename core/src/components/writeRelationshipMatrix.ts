// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { database } from '../superreality/database'

export async function writeRelationshipMatrix(speaker, agent, updateMatrix) {
    database.instance.setRelationshipMatrix(speaker, agent, updateMatrix)
}


