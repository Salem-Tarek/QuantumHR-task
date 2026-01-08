import api from "@/api"

function fetchUsers (){
  return api.get('https://randomuser.me/api/?results=50')
}


export { fetchUsers }