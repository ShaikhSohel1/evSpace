import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  setDoc,
  getDoc,
  where,
  query,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import NavBar from './components/NavBar'
import HistoryList from "./components/HistoryList";
import { useSession, signIn, signOut } from "next-auth/react";

export default function history() {
  const { data: session } = useSession();
  const [todos, settodos] = useState([]);
  const [book, setbook] = useState(false)

  const d = new Date();
  const date = d.getDate()
 console.log(date)
  const hours = d.getHours();
  console.log(hours)

const fetchPost = async () => {
  const docRef = await getDocs(collection(db, "booking")).then(
    (querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData)
      settodos(newData);
      console.log(todos);
    }
  );
};


useEffect(() => {
  fetchPost();

  return () => {
    console.log("This will be logged on unmount");
  }
}, [book]);

// todos.map(val => {
//   console.log(val.timestamp)
//   const dd = new Date(val.timestamp.seconds*1000)
//   const datefirbase = dd.getDate();
//   const hoursfirebase = d.getHours();
//   console.log(datefirbase, hoursfirebase)


//   // if(datefirbase == date && hoursfirebase > hours)
//   // console.log("yes")
//   // else
//   // console.log("no")
// })

  return (
    <div>
      <NavBar 
          home ={false}
          history ={true}
          booking ={false}
          />
{session ? (
  <>
  <h1 class="mx-5 my-4 font-bold text-[28px] text-white">bookings</h1>
{todos.map(val => (
  <HistoryList 
  id = {val.id}
  name = {val.LName}
  des = {val.LDescription}
  start ={val.start_time}
  end ={val.end_time}
  setbook ={setbook}
  book={book}
  image={val.image.url}
  />
))}
  </>
):(
  <>
  <div onClick={() => signIn()}>
                      <button className="flex flex-row min-h-screen justify-center items-center mx-auto bg-transparent border-red-100 text-blue-700 font-semibold hover:text-white py-2 px-4 border hover:border-transparent">
                        sign in
                      </button>
                      </div>
  </>
)}



{/* <div class="mx-5 my-4 flex h-52 flex-col rounded-lg bg-gray-900 font-serif text-black shadow-md">
  <div class="mt-4">
    <h1 class="mx-11 my-1 font-bold text-[20px] text-gray-600"></h1>
  </div>
  <div class="mx-11 mb-4 text-sm text-gray-500"><p></p></div>
  <div class="relative flex justify-center space-x-3">
    <span class="absolute inset-y-1 left-12 flex items-center pl-2">
    </span>

    <button class="w-32 rounded-lg border bg-blue-700 font-medium text-white hover:bg-blue-800">Subscribe</button>
  </div>

</div> */}



    </div>
  )
}
