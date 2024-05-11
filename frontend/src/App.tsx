import { useState } from "react"

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
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
      const [file] = event.target.files ?? []

      if(file){
        setFile(file)
        setAppStatus(APP_STATUS.READY_UPLOAD)
      }
  }

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>)  => {
      event.preventDefault()
      console.log('TODO')
  } 


  const showButton = appStatus === APP_STATUS.READY_UPLOAD || APP_STATUS.UPLOADING
    
  return (
    <>
      <h4>Challenge: Upload CSV + Search</h4>
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
          showButton
          &&
          <button>
            { BUTTON_TEXT[appStatus] }</button>
        }
      </form>
    </>
  )
}

export default App
