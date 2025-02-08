export function InputBox({label,place,onChange,value}){
    return <div className="py-2">
        <div className=" flex items-start px-6">{label}</div>
        <div className="px-6 flex items-start">
        <input onChange={onChange} type="text" value={value} placeholder={place} className="px-3 py-1 w-full border rounded-lg bg-custom-white border-custom-teal "/>
        </div>
    </div>
}