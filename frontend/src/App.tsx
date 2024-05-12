import { useState } from "react"
import { Toaster, toast } from 'sonner';
import { uploadFile } from "./services/upload";
import { type Data } from './types';
import { Search } from "./steps/Search";

// Como nuestra aplicación maneja diferentes estados, es importante tener un objeto que identifique el estado actual.
const APP_STATUS = {
  IDLE: 'idle', // al entrar
  ERROR: 'error', // Cuando hay un error
  READY_UPLOAD: 'ready_upload', // al elegirel archivo y antes de subirlo
  UPLOADING: 'uploading', // Mientras se sube
  READY_USAGE: 'ready_usage' // Despues de subir
} as const

  
const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo...',
} 

//Esta es la mejor forma de crear estados diferentes de una constante.
type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS];

function App() {
  const [appStatus, setAppStatus]  = useState<AppStatusType>(APP_STATUS.IDLE)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      const [file] = event.target.files ?? []

      if(file){
        setFile(file)
        setAppStatus(APP_STATUS.READY_UPLOAD)
      }
  }

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>)  => {
      event.preventDefault()
      
      if(!file || appStatus !== APP_STATUS.READY_UPLOAD){
        return
      }
      
      setAppStatus(APP_STATUS.UPLOADING)

      const [err, newData] = await uploadFile(file)

      if(err){
        setAppStatus(APP_STATUS.ERROR)
        toast.error(err.message)
        return
      }

      setAppStatus(APP_STATUS.READY_USAGE)
      if(newData) setData(newData)
        console.log(newData);
      toast.success("Archivo subido correctamente")

  }     

  const showInput = appStatus !== APP_STATUS.READY_USAGE

  return (
    <>
      <Toaster />
      <h4>Challenge: Upload CSV + Search</h4>
      {
        showInput
        ?
        <form onSubmit={handleSubmit}>
          <label htmlFor="">
            <input
              disabled={appStatus === APP_STATUS.UPLOADING} 
              type="file" 
              accept=".csv" 
              name="file" 
              onChange={handleInputChange}/>
          </label>
          {
            appStatus in BUTTON_TEXT
            &&
            <button disabled={appStatus === APP_STATUS.UPLOADING}>
                {BUTTON_TEXT[appStatus as keyof typeof BUTTON_TEXT]}
            </button>
          }
        </form>
        :
        <Search initialData={data} />
      }
      


    </>
  )
}

export default App
