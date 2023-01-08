import React from 'react'
import { MapPinIcon } from "@heroicons/react/24/solid";

export default function Marker({color, name, place, setplace, placeid, setplaceid, id}) {
  const updatee = () => {
    setplace(true)
    setplaceid(id)
  }
  return (
    <div> 
      


      <div className="absolute top-[50%] left-[50%] w-10 h-10 hover:scale-110 transition transform duration-200 ease-out cursor-pointer"
    title={name}
    onClick={updatee}
  >
  <MapPinIcon />
  </div>
  </div>
  )
}
