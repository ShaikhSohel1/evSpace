import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Banner from "./components/Banner";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import PlaceInfo from "./components/PlaceInfo";
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
  startAt,
  endAt,
  deleteDoc,
  SnapshotMetadata,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import PlaceInf from "./components/PlaceInf";
import Footer from "./components/Footer";
import Gap from "./components/Gap";

export default function Home() {
  const [todos, settodos] = useState([]);
  const [OpenPlace, setOpenPlace] = useState(false);
  const [OpenPlaceid, setOpenPlaceid] = useState();
  const [docss, setdocss] = useState([]);
  const [booking, setbooking] = useState([])
var arr;
var arr2;
var c= new Date();
  // console.log(OpenPlace)
  // console.log(OpenPlaceid)
  const fetchPost = async () => {
    const docRef = await getDocs(collection(db, "Places")).then(
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        settodos(newData);
        // console.log(todos);
        // console.log(newData);
      }
    );
  };

  const bookingslot = async () => {
    const docRef1 = await getDocs(collection(db, "booking")).then(
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setbooking(newData);
          // console.log(newData)
        }
      );
  };



  useEffect(() => {
    fetchPost();
    bookingslot();
  }, []);

  // console.log(OpenPlaceid)
  useEffect(() => {
    todos.map((val) => {
      if (val.id == OpenPlaceid) {
        // console.log(val);
        setdocss(val);
        // arr = booking.filter(post => post.placeid == OpenPlaceid)
        // console.log(arr)
      }
    });
  }, [OpenPlaceid]);




  // useEffect(async () => {
  //   // booking.map(async val => {
  //   //   // var d= new Date((val.date * 1000));
  //   //   // // var c= new Date();
  //   //   console.log(val)
  //   // })

  // }, []);


useEffect(() => {
      booking.map(async val => {
      var d= new Date((val.date * 1000));
      var c= new Date();
      // console.log(val.end_time, c.getHours())
      if(val.year <= c.getFullYear() && d.getMonth() <= c.getMonth() && d.getDate() <= c.getDate())
      {
        if(c.getHours() > val.end_time)
        {
         
          
          const docdocRefs = await addDoc(collection(db, "history"), {
            sessionId: val.sessionId,
            user: val.user,
            date: val.date,
            year: val.year,
            start_time: val.start_time,
            end_time: val.end_time,
            placeid: val.placeid,
            LDescription: val.LDescription,
            LName: val.LName,
            image: val.image,
            prize: val.prize,
            timestamp: serverTimestamp()
        });

          await deleteDoc(doc(db, "booking", val.id));
     
        }
       
      }
    })

  return () => {
    console.log("return");
  }
}, [])




  return (
    <div className="bg-gradient-to-r from-slate-900 to-gray-900">
      <NavBar home={true} history={false} booking={false} />
      <Banner />
      <Gap
        place={OpenPlace}
        setplace={setOpenPlace}
        placeid={OpenPlaceid}
        setplaceid={setOpenPlaceid}
        todos={todos}
      />
      {OpenPlace ? (
        <div>
          <PlaceInfo
            key={docss.id}
            id={docss.id}
            name={docss.Loc_Name}
            des={docss.LDescription}
            todos={todos}
            docs={booking}
          />
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
