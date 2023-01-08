import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { Fragment, useRef, useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import Filters from "./Filters";
import TimeSlots from "./TimeSlots";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
// import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "STRIPE_PUBLIC_KEY"
);

export default function PlaceInf({ id, name, des, todos }) {
  const { data: session } = useSession();
  const [model, setmodel] = useState(true);
  const [docss, setdocss] = useState([]);
  const [updatee, setupdatee] = useState(false);
  const [accesstime, setaccesstime] = useState([]);
  const [array, setarray] = useState([]);
  const [charging, setcharging] = useState();
  const [car, setcar] = useState();
  const [docss1, setdocss1] = useState([]);
  const [docss2, setdocss2] = useState([]);
  const [open, setOpen] = useState(false);
  var sort;
  var newItem;
  var newItem1;
  const Charging_Type = ["All", "Type-1", "Type-2", "Type-3"];
  const Select_Car = ["Tesla", "Lucid Motors", "Zoox", "Aptiv"];
  const cancelButtonRef = useRef(null);
  const [images, setimages] = useState([]);
  const [img1, setimg1] = useState();
  const [sumarray, setsumarray] = useState()
  const [startDate, setStartDate] = useState(new Date());
  const [booking, setbooking] = useState([])
  const datepick = useRef(null);
  const createCheckOutSession = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: array,
      email: session.user.email,
      prize: 12,
    });
    if(checkoutSession.data.id)
    {
      array.forEach(async element => {
        const docdocRefs = await updateDoc(doc(db, "Places", id, "Timing",element.id,), {
          book:true,
          user: session.user?.email,
          prize: 90
      })
      });
      const docRef = await addDoc(collection(db, "cart"),{
        Loc_name: checkoutSession.data.id,
        timestamp: serverTimestamp()
      });
    }

    
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) 
    {
      alert(result.error.message);
    }



    const bookingslot = async () => {
      const docRef1 = await getDocs(collection(db, "booking")).then(
          (querySnapshot) => {
            const newData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setbooking(newData)
            console.log(newData)
          }
        );
    };

    useEffect(() => {
     bookingslot();
     console.log(startDate)
    }, [startDate]);

    console.log(startDate)

    const changeDate = (date) => {
      console.log(date)
      setStartDate(date)
      console.log(startDate)
    };


    // if(checkoutSession)
    // {
    //   array.forEach(async element => {
    //     const docdocRefs = await updateDoc(doc(db, "Places", id, "Timing",element.id,), {
    //       book:true,
    //       user: session.user?.email,
    //       prize: 90
    //   })
    //   });
    // }
  };

  const fetchPost = async () => {
    if (id) {
      const docRef = await getDocs(
        collection(db, "Places", id, "Timing"),
        orderBy("end_time", "desc")
      ).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        //  setdocss(newData);
        sort = newData.slice(0);
        sort.sort(function (a, b) {
          return a.start_time - b.start_time;
        });
        //  console.log(sort)
        setdocss(sort);
        setdocss1(sort);
      });

      const docRef1 = await getDocs(
        collection(db, "Places", id, "images")
      ).then((querySnapshot) => {
        const newData1 = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        //  setdocss(newData);
        setimages(newData1);
      });
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (charging == "All") {
      setdocss1(docss);
    } else {
      const newItem = docss.filter((newVal) => {
        return newVal.Charging_Type === charging;
      });
      setdocss1(newItem);
    }
  }, [car, charging]);

  const imgPreview = (img) => {
    setimg1(img);
    setOpen(true);
  };

  useEffect(() => {
    const sum = array.reduce((accumulator, object) => {
      return accumulator + object.prize;
    }, 0);
    setsumarray(sum)
  }, [array]);



  return (
    <div className=" bg-gradient-to-r from-slate-900 to-slate-700 mx-5 my-6 rounded-[12px]">
      {/* bg-gradient-to-r from-slate-900 to-slate-700  bg-slate-800*/}
      <h1 className="font-medium leading-tight text-3xl mt-0 mb-2 mx-6 pt-3">
        Loc_name {name}
      </h1>
      <h6 className="font-medium leading-tight text-medium mt-0 mb-2 mx-6">
        des {des}
      </h6>

      <div class="grid lg:grid-cols-9 gap-2 items-center mx-6 my-3 grid-cols-3">
        {images.map((val) => (
          <div
            className="mb-4 hover:scale-110 transition transform duration-200 ease-out"
            onClick={() => imgPreview(val.url)}
          >
            <img src={val.url} className="w-full h-auto rounded-lg" alt="fg" />
          </div>
        ))}
      </div>

      <div class="justify-between bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="flex">
          <div
            className="text-center bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 w-[50%] p-6 rounded-tl-[5px] cursor-default"
            onClick={() => setmodel(true)}
          >
            Charging Stations
          </div>
          <div
            className="text-center bg-gradient-to-tr from-slate-900 via-black to-slate-900 w-[50%] p-6 rounded-tr-[5px] cursor-default"
            onClick={() => setmodel(false)}
          >
            Repair & Service
          </div>
        </div>

        {model ? (
          <div className="p-6 bg-white rounded-b-[5px] bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Location Name
            </h5>

            <div class="flex flex-row-reverse gap-4">
              <Filters
                option="Charging Type"
                select={Charging_Type}
                item={charging}
                setitem={setcharging}
              />
                            {/* date picker */}
<div>
              <DatePicker selected={startDate} onChange={(date) => changeDate(date)} className="form-control block px-3 py-1.5 text-base font-normal text-white bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:outline-none"
              placeholder="Select a date"
              />
              </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-9 md:grid-cols-5">
              {booking.map(val => {
                if(val.date == startDate)
                {
                  console.log(val.date)
                  // {docss1.map((val1) => (
                  //   <TimeSlots
                  //     key={val1.id}
                  //     id={val1.id}
                  //     ogid={id}
                  //     start={val1.start_time}
                  //     end={val1.end_time}
                  //     val={val1.book}
                  //     array={array}
                  //     setarray={setarray}
                  //     name={name}
                  //     booking={booking}
                  //   />
                  // ))}
                }
              })}
              {docss1.map((val) => (
                <TimeSlots
                  key={val.id}
                  id={val.id}
                  ogid={id}
                  start={val.start_time}
                  end={val.end_time}
                  val={val.book}
                  array={array}
                  setarray={setarray}
                  name={name}
                />
              ))}

              {!docss1 ? (
                <div>
                  {docss.map((val) => (
                    <TimeSlots
                      key={val.id}
                      id={val.id}
                      ogid={id}
                      start={val.start_time}
                      end={val.end_time}
                      val={val.book}
                      array={array}
                      setarray={setarray}
                      name={name}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-b-[5px] bg-gradient-to-tr from-slate-900 via-black to-slate-900">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Location Name
            </h5>

            <div className="grid grid-cols-3 lg:grid-cols-9 md:grid-cols-5">
              {docss1.map((val) => (
                <TimeSlots
                  key={val.id}
                  id={val.id}
                  ogid={id}
                  start={val.start_time}
                  end={val.end_time}
                  val={val.book}
                  array={array}
                  setarray={setarray}
                  name={name}
                />
              ))}

              {!docss1 ? (
                <div>
                  {docss.map((val) => (
                    <TimeSlots
                      key={val.id}
                      id={val.id}
                      ogid={id}
                      start={val.start_time}
                      end={val.end_time}
                      val={val.book}
                      array={array}
                      setarray={setarray}
                      name={name}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <div class="flex flex-row-reverse">
        <div onClick={createCheckOutSession}>
          <section className="flex">
            <button
              className="bg-blue-500 hover:bg-sky-500 hover:ring-sky-500 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-6 mx-4 my-5"
              type="submit"
              role="link"
            >
              Checkout
              <div className="mx-3 flex-row">
              {sumarray ? (
                <>
                (
                &#8377;
                {sumarray})
                </>
              ): null}
              </div>
            </button>
          </section>
        </div>
      </div>

      {open ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-transparent bg-slate-500 bg-opacity-50"
            onClick={() => setOpen(false)}
          >
            <div className="relative w-auto my-6 mx-4 max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div>
                  <img src={img1} class="w-full h-auto rounded-lg" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
