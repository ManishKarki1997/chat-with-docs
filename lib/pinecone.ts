import { Pinecone, PineconeRecord, } from '@pinecone-database/pinecone';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter"
import md5 from 'md5'

import { downloadFromS3 } from './s3-server';
import { getEmbeddings } from './embeddings';
import { convertToAscii } from './utils';

let pinecone: Pinecone | null = null

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number }
  }
}

export const getPineconeClient = async (): Promise<Pinecone | null> => {
  if (!process.env.NEXT_PUBLIC_PINECONE_API_KEY) {
    throw new Error("Pinecone API key not found")
  }

  pinecone = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!
  });

  return pinecone
}

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. get the pdf
  console.log("Step 1: downloading file from s3")
  const fileName = await downloadFromS3(fileKey)

  if (!fileName) {
    throw new Error("Couldn't download file from s3")
  }

  const loader = new PDFLoader(fileName)
  const pages = (await loader.load()) as PDFPage[]

  // 2. split the pages and segment them
  console.log("Step 2: preparing documents")
  const documents = await Promise.all(pages.map(prepareDocument))

  // 3. vectorize and embed individual documents
  console.log("Step 3: embedding documents")
  const vectors = await Promise.all(documents.flat().map(embedDocument))

  // 4. insert the vectors into pinecone
  const client = await getPineconeClient();
  console.log("Getting pinecone client")
  if (!client) return;

  const pineconeIndex = client.Index("chat-with-docs")
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey))

  console.log("Step 4: Upserting to pinecone")

  await namespace.upsert(vectors)


  return documents[0]
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent)
    const hash = md5(doc.pageContent)

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber
      }
    } as PineconeRecord
  } catch (error) {
    console.log("Error creating embedding of document ", error)
    throw error
  }
}


export function truncateStringByBytes(text: string, bytes: number) {
  const enc = new TextEncoder()
  return new TextDecoder("utf-8").decode(enc.encode(text).slice(0, bytes))
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page
  pageContent = pageContent.replace(/\n/g, "")

  const splitter = new RecursiveCharacterTextSplitter()
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 3600)
      }
    })])

  return docs
}