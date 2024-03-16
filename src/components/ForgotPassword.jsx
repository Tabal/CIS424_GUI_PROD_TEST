import { useState } from "react";
import axios from "axios";
import routes from "../routes.js";
import { useNavigate } from "react-router-dom";




function ForgotPassword() {

  const navigate = useNavigate();


  const [username, setUsername] = useState('');
  const [usernameFound, setUsernameFound] = useState(false);
  const [managerUsername, setManagerUsername] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [managerFound, setManagerFound] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');


  function handleCancel(){
     navigate(routes.signout);
     setMessage('');
  }


  function handleNewPasswordSubmit(){
    //handle new password post request
    


  }

  function handleUsernameSubmit() {
   
    setMessage('');

    // e.preventDefault();
    const url = `https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/ViewUsers`;
    axios.get(url)
      .then((response) => {
        //console.log(response.data);
        // Using forEach method
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          if (username === item.username) {
            setMessage('');
            setManagerUsername('');
            setUsernameFound(true);
            break;
          } else {
            setMessage("Invalid username");
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  function handleManagerSubmit() {
    setMessage(' ');
    // e.preventDefault();
    const data = {
      "username": managerUsername,
      "password": managerPassword,
    };

    axios.post('https://cis424-rest-api.azurewebsites.net/SVSU_CIS424/AuthenticateUser', data)
      .then(response => {
        console.log(response.data);
        if (response.data.IsValid == true){
            console.log(response.data);
            setMessage('');
            setManagerFound(true);

        }
      else{
          //invalid credentials
          console.log("Invalid credentials");
         setMessage("Invalid Manager Credentials");
      }
      })
      .catch(error => {
        console.error(error);
  
      });
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
          <h2 className="text-red-500 font-semibold mb-4">{message}</h2>
          {managerFound ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCancel}
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <>
              {!usernameFound ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Enter your username:</label>
                    <input
                      placeholder="Enter your username"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                
                  <div className="flex items-center justify-between">
                  <button
                      onClick={handleCancel}
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUsernameSubmit}
                      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Manager's Username:</label>
                    <input
                      value={managerUsername}
                      onChange={(e) => setManagerUsername(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Manager's Password:</label>
                    <input
                      type="password"
                      onChange={(e) => setManagerPassword(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleManagerSubmit}
                      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
              }

export default ForgotPassword;