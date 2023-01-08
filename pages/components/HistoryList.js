import { MapPinIcon } from "@heroicons/react/24/outline";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useEffect } from "react";
import { db } from "../../firebase/firebase";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HistoryList({id, name, des, start, end, setbook, book, image }) {
  const { data: session } = useSession();
  const cancelBooking = async () => {
    await deleteDoc(doc(db, "booking", id));
    setbook(!book)
  }
  return (
    <div>
      <div class="mx-5 my-4 flex flex-col rounded-lg bg-gray-900  text-black shadow-md">
        <div class="mt-4">
          <h1 class="mx-11 my-1 font-bold text-[24px] text-gray-100">{name}</h1>
        </div>
        <div class="mx-11 mb-4 text-sm text-gray-200 flex">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <p>{des}</p>
        </div>
        <div class="grid lg:grid-cols-9 gap-2 items-center mx-6 grid-cols-3 pb-3 md:grid-cols-4 mt-0">
          <div className="mb-4 hover:scale-90 transition transform duration-200 ease-out">
            <img
              src={image}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="my-0 col-span-2">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded mx-3 my-3">
              {start}-{end}
            </button>
            
          </div>
        </div>

        <div class="flex flex-row-reverse mx-3 my-3">
        <div>
          <section>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={cancelBooking}
          >
  cancel
</button>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
