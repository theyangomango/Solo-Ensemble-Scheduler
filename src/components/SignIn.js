import { signInWithGooglePopup, signInWithEmail } from "../utils/utils.firebase";
import { useState } from "react";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   

    return (
        <div>
            <input 
              placeholder="Email"
              onChange={(e) => {setEmail(e.target.value);}}
            />
            <input 
              placeholder="Password" 
              onChange={(e) => {setPassword(e.target.value);}}
            />

            <button onClick= {() => {signInWithEmail(email, password)}}>Sign in with Email</button>
            <button onClick= {signInWithGooglePopup}>Sign in with Google</button>
        </div>
    );
}

export default SignIn;