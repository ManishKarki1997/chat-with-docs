import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
  // retrieves the top K similar vectors

  try {
    const pinecone = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!
    });

    if (!pinecone) {
      throw new Error("Pinecone client not found")
    }


    const pineconeIndex = pinecone.Index("chat-with-docs")
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey))
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    })

    return queryResult.matches || []

  } catch (error) {
    console.error("Error retrieving matches from embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query)
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey)

  const qualifyingDocs = matches.filter(match => match.score && match.score > 0.7)

  type Metadata = {
    text: string;
    pageNumber: number;
  }

  let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text)
  return docs.join("\n")
    .substring(0, 3000)
}