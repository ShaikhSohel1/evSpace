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


export default function booking() {
  const { data: session } = useSession();
  const [todos, settodos] = useState([]);
  const [book, setbook] = useState(false)

  const d = new Date();
  const date = d.getDate()
 console.log(date)
  const hours = d.getHours();
  console.log(hours)

const fetchPost = async () => {
  const docRef = await getDocs(collection(db, "history")).then(
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


  return (
    <div className="bg-gradient-to-r from-slate-900 to-gray-900">
    <NavBar home={false} history={false} booking={true} />
    {session ? (
  <>
  <h1 class="mx-5 my-4 font-bold text-[28px] text-white">history</h1>
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
  </div>
  )
}
