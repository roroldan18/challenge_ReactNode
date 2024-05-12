import { useEffect, useState } from "react"
import { Data } from "../types"
import { searchData } from "../services/search";
import { toast } from 'sonner';
import { useDebounce } from '@uidotdev/usehooks'

const DEBOUNCE_TIME = 300;

export const Search = ({ initialData }: {initialData: Data}) => {
    const [data, setData] = useState<Data>(initialData);
    
    // Con este estado inicial, lo que logro es que si en la URL ya tengo el parametro filtrado, cuando subo el CSV, ya aparecen los resultados filtrados.
    const [search, setSearch] = useState<string>( () => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    // Lo que hace es que el valor del search lo almacena por un "cierto tiempo". Es decir, el debounce solo se actualizará cada 500ms. De esta forma detectará 
    // cuando el usuario termine de escribir. De forma que si hace una query de "JUAN" no se realizarán peticiones por la J, la U , la A y la N. Sino cuando termine de escribir.
    const debouncedSearch = useDebounce(search, DEBOUNCE_TIME)

    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        const newPathname = debouncedSearch === '' ? window.location.pathname : `?q=${debouncedSearch}`
        // Paso 1: Cada vez que cambie el search vamos a cambiar la URL.
        
        window.history.pushState({}, '', newPathname)

    }, [debouncedSearch])

    useEffect(() => {

        if(!debouncedSearch){
            setData(initialData)
            return
        }
        //Llamamos a la API para filtrar los resultados
        searchData(debouncedSearch)
            .then(response => {
                const [err, newData]  = response
                if(err){
                    toast.error(err.message);
                    return
                }

                if(newData){
                    setData(newData);
                }
            }) 
    }, [debouncedSearch, initialData])

    return (
        <div>
            <h1>Search</h1>
            <form>
                <input type="search" placeholder="Buscar información ..." onChange={handleSearch} defaultValue={search} />
            </form>
            <ul>
                {data.map((row) => (
                    <li key={row.id}>
                        <article>
                            {
                                Object
                                .entries(row)
                                .map(([key, value]) => <p key={key}><strong>{key}:</strong>{value}</p>) 
                            }
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}