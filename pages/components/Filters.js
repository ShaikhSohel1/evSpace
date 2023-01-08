import React, { useState } from 'react'

export default function ({option, select, item, setitem}) {
    const [model, setmodel] = useState(false)

    const filterItem1 = (type) => {
       setitem(type)
       setmodel(!model)
       console.log(!model)
      };

  return (
    <div>
        <div className="relative inline-block text-left">
  <div>
    <button type="button" className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100" id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={() => setmodel(!model)}>
      {option}
      <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
  {model ? (
      <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div className="py-1" role="none">
        {select.map(val => (
            <a className="text-gray-700 block px-4 py-2 text-sm cursor-default hover:bg-slate-300" role="menuitem" tabindex="-1" id="menu-item-0"
            onClick={() => filterItem1(val)}>{val}</a>
        ))}
        {/* <a className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Type-1</a>
        <a className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Type-2</a>
        <a className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">Type-3</a> */}

      </div>
    </div>
  ):(
    <div></div>
  )}


</div>

    </div>
  )
}
