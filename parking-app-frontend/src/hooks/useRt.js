import axios from "../components/axios";
import { getWithExpiry } from "../utils/authUtils";
import { addRToken } from "../utils/authUtils";
const useRt = () => {
    const refresh = async () => {
        console.log("using refresh") //Test
        if(getWithExpiry('rusc')!=null){
        const response = await axios.post('/refresh',{
            rusc: getWithExpiry('rusc')
        })
        console.log(response)
        addRToken(response.data.rusc)
        }
        else{
            console.log('expired refresh t')
            return null
        }
    } 
    return refresh
}
export default useRt