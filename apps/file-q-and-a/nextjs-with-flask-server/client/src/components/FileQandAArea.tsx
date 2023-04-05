import React, { memo, useCallback, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AnchorProvider} from "@project-serum/anchor"
import FileViewerList from "./FileViewerList";
import LoadingText from "./LoadingText";
import { isFileNameInString } from "../services/utils";
import { FileChunk, FileLite } from "../types/file";
import { SERVER_ADDRESS } from "../types/constants";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";

type FileQandAAreaProps = {
  files: FileLite[];
};

function FileQandAArea(props: FileQandAAreaProps) {
  const searchBarRef = useRef(null);
  const wallet = useAnchorWallet();
  let connection = new Connection( 'https://rpc.helius.xyz?api-key=6c062205-5e4e-4154-96e1-69d291255b43')
  const [answerError, setAnswerError] = useState("");
  const [searchResultsLoading, setSearchResultsLoading] =
    useState<boolean>(false);
  const [answer, setAnswer] = useState("");

  const handleSearch = useCallback(async () => {
    if (searchResultsLoading) {
      return;
    }

    const question = (searchBarRef?.current as any)?.value ?? "";
    setAnswer("");


    setSearchResultsLoading(true);
    setAnswerError("");

    let results: FileChunk[] = [];

    try {
    

      const tx = new Transaction().add(SystemProgram.transfer({
        // @ts-ignore
        fromPubkey: wallet.publicKey as  PublicKey,
        toPubkey: new PublicKey("JARekenxSxDMtKs4ZmQT2beo7eE7UwdWAtFBMGa3C2tg"),
        lamports: 0.0 * 10 ** 9
      }))
      // @ts-ignore
      tx.feePayer = wallet.publicKey
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      // @ts-ignore
      const provider = new AnchorProvider(connection, wallet, {})
      const answerResponse = await axios.post(
        `${SERVER_ADDRESS}/answer_question`,
        {
          question,
        }
      );

      if (answerResponse.status === 200) {
        setAnswer(answerResponse.data);
      } else {
        setAnswerError("Sorry, something went wrong!");
      }
    
    } catch (err: any) {
      console.log(err)
      setAnswerError("Sorry, something went wrong!");
    }

    setSearchResultsLoading(false);
  }, [props.files, searchResultsLoading]);

  const handleEnterInSearchBar = useCallback(
    async (event: React.SyntheticEvent) => {
      if ((event as any).key === "Enter") {
        await handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className="space-y-4 text-gray-800">
      <div className="mt-2">
        Ask a question based on the algorithm codebase:
      </div>
      <div className="space-y-2">
        <input
        style={{width: "300%"}}
          className="border rounded border-gray-200 w-full py-1 px-2"
          placeholder="e.g. How can we game the toxicity score?"
          name="search"
          ref={searchBarRef}
          onKeyDown={handleEnterInSearchBar}
        />
        <div
          className="rounded-md bg-gray-50 py-1 px-4 w-max text-gray-500 hover:bg-gray-100 border border-gray-100 shadow cursor-pointer"
          onClick={handleSearch}
        >
          {searchResultsLoading ? (
            <LoadingText text="Answering question..." />
          ) : (
            "Ask question"
          )}
        </div>
      </div>
      <div className="">
        {answerError && <div className="text-red-500">{answerError}</div>}
        <Transition
          show={answer !== ""}
          enter="transition duration-600 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-125 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
          className="mb-8"
        >
          {/* answer from files */}
          {answer && (
            <div className="">
              <ReactMarkdown className="prose" linkTarget="_blank">
                {answer}
              </ReactMarkdown>
            </div>
          )}

          <Transition
            show={
              props.files.filter((file) =>
                isFileNameInString(file.name, answer)
              ).length > 0
            }
            enter="transition duration-600 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-125 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
            className="mb-8"
          >
            <FileViewerList
              files={props.files.filter((file) =>
                isFileNameInString(file.name, answer)
              )}
              title="Sources"
              listExpanded={true}
            />
          </Transition>
        </Transition>
      </div>
    </div>
  );
}

export default memo(FileQandAArea);
