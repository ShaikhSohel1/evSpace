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
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import TimeSlots from "./TimeSlots";
import "react-datepicker/dist/react-datepicker.css";
import Filters from "./Filters";
import Time from "./Time";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
// import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

import DatePicker from "react-datepicker";


const stripePromise = loadStripe(
  "STRIPE_PUBLIC_KEY"
);




export default function PlaceInfo({ id, name, des, docs }) {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState(new Date());
  const [booking, setbooking] = useState([]);
  const [todos, settodos] = useState([]);
  const [images, setimages] = useState([]);
  const [model, setmodel] = useState(true);
  const [charging, setcharging] = useState();
  const [book, setbook] = useState(false);
  const [array, setarray] = useState([]);
  const [sumarray, setsumarray] = useState()
  const d = new Date();
  const d1 = new Date("2022-12-25");
  const [checkout, setcheckout] = useState(null);
  


  // console.log(startDate.getDate(), startDate.getMonth(), startDate.getDay(), startDate.getFullYear())
  const Charging_Type = ["All", "Type-1 AC", "Type-2 CCS-350kW*", "GB/T 10-15kW"];
  var sort;
  var dd;

   const isWeekday = (date) => {
    const day = Date(date);
    // console.log(day !== 0 && day !== 6) ;
    return date > d;
  };


  // cheackout session

  const createCheckOutSession = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: array,
      email: session.user.email,
      prize: 12,
    });



    if(checkoutSession.data.id)
    {
      const docRef = await addDoc(collection(db, "payments"),{
        Loc_name: checkoutSession.data.id,
        data: checkoutSession.data.status,
        timestamp: serverTimestamp()
      });
      if(docRef)
      {
        array.forEach(async element => {
          const docdocRefs = await addDoc(collection(db, "booking"), {
            sessionId: checkoutSession.data.id,
            user: session.user?.email,
            date: startDate,
            year: startDate.getFullYear(),
            start_time: element.start_time,
            end_time: element.end_time,
            placeid: id,
            LDescription: des,
            LName: name,
            image: images[0],
            prize: 90,
            timestamp: serverTimestamp()
        })
        });
      }
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
            // console.log(daata)
          }
        );
    };

    useEffect(() => {
     bookingslot();
    }, [startDate]);

    console.log(startDate)

    const changeDate = (date) => {
      console.log(date)
      setStartDate(date)
      console.log(startDate)
    };

  };











  const fetchPost = async () => {
    if (id) {
      const docRef = await getDocs(collection(db, "Places", id, "Timing")).then(
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          settodos(newData);
          sort = newData.slice(0);
          sort.sort(function (a, b) {
            return a.start_time - b.start_time;
          });
          settodos(sort);
          
        }
      );

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
    const sum = array.reduce((accumulator, object) => {
      return accumulator + object.prize;
    }, 0);
    setsumarray(sum)
  }, [array]);

  
  


  return (
    <div className='className=" bg-gradient-to-r from-slate-900 to-slate-700 mx-5 my-6 rounded-[12px]"'>
      <h1 className="font-medium leading-tight text-3xl mt-0 mb-2 mx-6 pt-3">
        {name}
      </h1>
      <h6 className="font-medium leading-tight text-medium mt-0 mb-2 mx-6">
        {des}
      </h6>

      <div className="grid lg:grid-cols-9 gap-2 items-center mx-6 my-3 grid-cols-3">
        {images.map((val) => (
          <div
            className="mb-4 hover:scale-110 transition transform duration-200 ease-out"
            // onClick={() => imgPreview(val.url)}
          >
            <img src={val.url} className="w-full h-auto rounded-lg" alt="fg" />
          </div>
        ))}
      </div>

      <div className="justify-between bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
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
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
         
            </h5>

            <div className="flex flex-row-reverse gap-4">
              <Filters
                key = {Math.random()*10}
                option="Charging Type"
                select={Charging_Type}
                item={charging}
                setitem={setcharging}
              />
              {/* date picker */}
              <div>
    
                <DatePicker
                  selected={startDate}
                  filterDate={isWeekday}
                  onChange={(date) => setStartDate(date)}
                  className="form-control block px-3 py-1.5 text-base font-normal text-white bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:outline-none"
                  placeholder="Select a date"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-9 md:grid-cols-5">

              {todos.map(post => {
                var flag = 0;
                docs.map(val => {
                 dd = new Date(val.date.seconds * 1000);
                 if(val.placeid == id)
                 {
                  if (
                    dd.getFullYear() == startDate.getFullYear() &&
                    dd.getMonth() == startDate.getMonth() &&
                    dd.getDate() == startDate.getDate()
                  )
                  {
                    if(val.start_time == post.start_time)
                     return flag = 1;
                  }
                 }
                });
                if(flag == 1)
                {
                  return (
                    <>
                    <Time
      key={post.id}
      id={post.id}
      ogid={id}
      start={post.start_time}
      end={post.end_time}
      val={true}
      array={array}
      setarray={setarray}
      name={name}
      startDate={startDate}
      docs={docs}
    />
                    </>
                  );
                }
                else{
                  return (
                    <>
                    <Time
      key={post.id}
      id={post.id}
      ogid={id}
      start={post.start_time}
      end={post.end_time}
      val={false}
      array={array}
      setarray={setarray}
      name={name}
      startDate={startDate}
      docs={docs}
    />
                    </>
                  );
                }
              })}

         
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-b-[5px] bg-gradient-to-tr from-slate-900 via-black to-slate-900">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          </h5>

          <div className="flex flex-row-reverse gap-4">
            <Filters
              key = {Math.random()*10}
              option="Charging Type"
              select={Charging_Type}
              item={charging}
              setitem={setcharging}
            />
            {/* date picker */}
            <div>
              <DatePicker
                selected={startDate}
                filterDate={isWeekday}
                onChange={(date) => setStartDate(date)}
                className="form-control block px-3 py-1.5 text-base font-normal text-white bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:outline-none"
                placeholder="Select a date"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-9 md:grid-cols-5">

            {todos.map(post => {
              var flag = 0;
              docs.map(val => {
               dd = new Date(val.date.seconds * 1000);
               if(val.placeid == post.id)
               {
                if (
                  dd.getFullYear() == startDate.getFullYear() &&
                  dd.getMonth() == startDate.getMonth() &&
                  dd.getDate() == startDate.getDate()
                )
                {
                  if(val.start_time == post.start_time)
                   return flag = 1;
                }
               }
              });
              if(flag == 1)
              {
                return (
                  <>
                  <Time
    key={post.id}
    id={post.id}
    ogid={id}
    start={post.start_time}
    end={post.end_time}
    val={true}
    array={array}
    setarray={setarray}
    name={name}
    startDate={startDate}
    docs={docs}
  />
                  </>
                );
              }
              else{
                return (
                  <>
                  <Time
    key={post.id}
    id={post.id}
    ogid={id}
    start={post.start_time}
    end={post.end_time}
    val={false}
    array={array}
    setarray={setarray}
    name={name}
    startDate={startDate}
    docs={docs}
  />
                  </>
                );
              }
            })}

       
          </div>
        </div>
        )}

{/* payment button */}
{
  session?(<div className="flex flex-row-reverse bg-gray-900">
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
</div>):(
  <div className="flex flex-row-reverse bg-gray-900">
  <div onClick={signIn}>
    <section className="flex">
      <button
        className="bg-blue-500 hover:bg-sky-500 hover:ring-sky-500 text-white font-bold py-2 px-4 border border-blue-700 rounded mt-6 mx-4 my-5"
        type="submit"
        
      >
        signIn
        <div className="mx-3 flex-row">
        
        </div>
      </button>
    </section>
  </div>
</div>
)
}
{/* <div class="flex flex-row-reverse">
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
      </div> */}






      </div>
    </div>
  );
}

//  <div className='w-full pr-10'>

// <div>
//       <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="form-control block px-3 py-1.5 text-base font-normal text-white bg-gradient-to-tr from-slate-900 via-gray-800 to-slate-900 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:outline-none"
//       placeholder="Select a date"
//       />
//       </div>
//       {docs.map(val => {
//         dd = new Date(val.date.seconds*1000)

//       if(dd.getFullYear() == startDate.getFullYear() && dd.getMonth() == startDate.getMonth() && dd.getDate() == startDate.getDate())
//       {
//         console.log("true",val)
//         return(
//             todos.map(post => {
//                 if(val.start_time == post.start_time)
//                 {
//                     return(
//                         <a
//                         className="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mx-3 m-4 w-24 h-12 cursor-default"
//                       >
//               {post.start_time}-{post.end_time}
//           </a>
//                     )
//                 }
//                 else{
//                     return(
//                         <a
//         className="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-3 m-4 w-24 h-12 cursor-default"
//       >
// {post.start_time}-{post.end_time}
// </a>
//                     )
//                 }

//       })

//         )
//       }
//       else{
//         return(
//             todos.map(post => (
//                 <a
//         className="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-3 m-4 w-24 h-12 cursor-default"
//       >
// {post.start_time}-{post.end_time}
// </a>
//             ))
//         )
//       }
//     }

//       )}

// </div>
