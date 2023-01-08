import React, { useState } from 'react'

export default function TimeSlots({id, start, end, setarray, array, val, name}) {
  const [book, setbook] = useState(false)
 const flag = 0;
 var arr;
//  console.log(booking)
  const updateval= async (id1,end1) => {
    setbook(!book)
    console.log(book)
    if(book == false)
    {
      array.map(val => {
        if(val.id == id)
        flag == 1
      })
      if(flag == 0)
      {
        setarray([...array, {start_time: start, end_time: end1, id: id1, prize: 90, name: name}])
      }
    }
    else {
      arr = array.filter(val => val.id !== id)
      setarray(arr)
    }






    // console.log(id1,end1)
    
    
    // setarray([...array, {start_time: start, end_time: end1, id: id1, prize: 90, name: name}])
}

  return (
    <div>
      {val ? (
                                <a
                                className="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mx-3 m-4 w-24 h-12 cursor-default"
                              >
                      {start}-{end}
                  </a>
      ):(
        <div>
                {book ?(
                         <a
                         className="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mx-3 m-4 w-24 h-12 cursor-default"
                         onClick={() =>updateval(id,end)}
                       >
               {start}-{end}
           </a>
      ):(
        <a
        className="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-3 m-4 w-24 h-12 cursor-default"
        onClick={() =>updateval(id,end)}
      >
{start}-{end}
</a>
      )}
        </div>
      )}

                 {/* <a
                  href="#"
                  class="inline-flex items-center px-7 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-3 m-4 w-24 h-12"
                >
        {start}-{end}
    </a> */}
    </div>
  )
}
