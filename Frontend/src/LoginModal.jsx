// import React, { useContext, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "./context/AuthContext";
// import toast from "react-hot-toast";

// const LoginModal = (props) => {
//     const [state, setState] = useState("login");

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [role, setRoleLocal] = useState("");
//     const [companyName, setCompanyName] = useState("");
//     const [companyLogo, setCompanyLogo] = useState(null);

//     const { setIsLoggedIn, setRole, setUser } = useContext(AuthContext);

//     const [errors, setErrors] = useState({});

//     const handleState = () => {
//         setState(prev => (prev === "login" ? "signup": "login"));
//         setErrors({});
//         setCompanyName("");
//         setCompanyLogo(null);
//     }

//     const handleRoleChange = (selectedRole) => {
//         setRoleLocal(selectedRole);
//         if (selectedRole !== "HR") {
//             setCompanyName("");
//             setCompanyLogo(null);
//         }
//     }

//     const handleSubmit = async(e) => {
//         e.preventDefault();

//         const newErrors = {
//             name: state === "signup" && name.trim() === "",
//             email: email.trim() === "" || !/\S+@\S+\.\S+/.test(email),
//             password: password.trim() === "" || password.length < 4,
//             role: state === "signup" && role === "",
//             companyName: state === "signup" && role === "HR" && companyName.trim() === "",
//             companyLogo: state === "signup" && role === "HR" && !companyLogo
//         };

//         setErrors(newErrors);
        
//         const hasError = Object.values(newErrors).some(error => error);
        
//         if (!hasError) {
//             const formData = new FormData();
//             formData.append('name', name);
//             formData.append('email', email);
//             formData.append('password', password);
//             formData.append('role', role);
            
//             if (role === "HR") {
//                 formData.append('companyName', companyName);
//                 if (companyLogo) {
//                     formData.append('companyLogo', companyLogo);
//                 }
//             }
            
//             console.log(formData);

//             try {
//                 if (state === "signup") {
//                     const response = await axios.post("http://localhost:3000/api/register", formData, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     });
//                     toast.promise(
//                         response,
//                         {
//                             loading: 'Saving...',
//                             success: <><b>Registration done successfully!</b><br />Please login</>,
//                             error: <b>Registration failed. Please try again.</b>,
//                         }
//                     );
//                     console.log("Signup success:", response.data);
                    
//                     setState("login");
//                     setName("");
//                     setEmail("");
//                     setPassword("");
//                     setRoleLocal("");
//                     setCompanyName("");
//                     setCompanyLogo(null);
//                 } else {
//                     const response = await axios.post("http://localhost:3000/api/login", { email, password });
//                     console.log("Login success:", response.data);

//                     localStorage.setItem("token", response.data.token);
//                     localStorage.setItem("user", JSON.stringify(response.data.user));
                    
//                     setUser(response.data.user);
//                     setRole(response.data.user.role);
//                     setIsLoggedIn(true);
//                     props.handleClose();
//                 }
//             } catch (error) {
//                 console.error("API error:", error.response?.data || error.message);
//                 setErrors({ submit: "An error occured. Please try again." });
//             }

//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//             <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
//                 <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800 focus:outline-none" onClick={props.handleClose}>&times;</button>
                
//                 <p className="font-bold text-center mb-2">{ state === "login" ? "Sign in to your account" : "Create your account" }</p>
                
//                 <p className="font-thin text-center mb-4">{ state === "login" ? "Welcome back! Please sign in to continue" : "Hi! Please sign up to continue" }</p>

//                 {
//                     state === "signup" && (
//                         <div className="mb-4">
//                             <label htmlFor="name" className="text-left">Full name</label><br />
//                             <input type="text" name="name" id="name" className={`border w-full rounded p-2 required:border-red-500 ${errors.name ? 'outline-red-600' : 'outline-none'}`} value={name} onChange={(e) => setName(e.target.value)} />
//                             {errors.name && <p className="text-red-500 text-sm">Name is required.</p>}
//                         </div>
//                     )
//                 }

//                 <div className="mb-4">
//                     <label htmlFor="email" className="text-left">Email address</label><br />
//                     <input type="email" name="email" id="email" className={`border w-full rounded p-2 required:border-red-500 ${errors.email ? 'outline-red-600' : 'outline-none'}`} value={email} onChange={(e) => setEmail(e.target.value)} />
//                     {errors.email && <p className="text-red-500 text-sm">Please enter a valid email.</p>}
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="password">Password</label><br />
//                     <input type="password" name="password" id="password" className={`border w-full rounded p-2 required:border-red-500 ${errors.password ? 'outline-red-600' : 'outline-none'}`} value={password} onChange={(e) => setPassword(e.target.value)} />
//                     {errors.password && <p className="text-red-500 text-sm">Password must be at least 4 characters.</p>}
//                 </div>

//                 {
//                     state === "signup" && (
//                         <div className="flex flex-col mb-6">
//                             <p className="mb-1">Choose your role</p>
//                             <div className="flex items-center justify-between">
//                                 <div className={`border px-6 py-2 rounded flex items-center justify-center gap-2 cursor-pointer duration-300 ease-in-out ${role === "User" ? "bg-blue-100 border-blue-500 shadow-md scale-105" : "hover:bg-gray-300/50 hover:scale-105 hover:shadow-lg"}`} onClick={() => handleRoleChange("User")}>
//                                     <input type="radio" id="student" name="role" value="User" checked={role === "User"} onChange={() => handleRoleChange("User")} className="hidden" />
//                                     <label htmlFor="student" className="cursor-pointer">Become a Student</label>
//                                 </div>

//                                 <div className={`border px-6 py-2 rounded flex items-center justify-center gap-2 cursor-pointer duration-300 ease-in-out ${role === "HR" ? "bg-blue-100 border-blue-500 shadow-md scale-105" : "hover:bg-gray-300/50 hover:scale-105 hover:shadow-lg"}`} onClick={() => handleRoleChange("HR")}>
//                                     <input type="radio" id="employee" name="role" value="HR" checked={role === "HR"} onChange={() => handleRoleChange("HR")} className="hidden" />
//                                     <label htmlFor="employee" className="cursor-pointer">Become an Employee</label>
//                                 </div>
//                             </div>
//                             {errors.role && <p className="text-red-500 text-sm">Please select your role.</p>}
//                         </div>
//                     )
//                 }

//                 {
//                     state === "signup" && role === "HR" && (
//                         <div className="mb-6">
//                             <div className="mb-4">
//                                 <label htmlFor="companyName" className="text-left">Company Name</label><br />
//                                 <input type="text" name="companyName" id="companyName" className={`border w-full rounded p-2 ${errors.companyName ? 'outline-red-600' : 'outline-none'}`} value={companyName} onChange={(e) => setCompanyName(e.target.value)}placeholder="Enter your company name" />
//                                 {errors.companyName && <p className="text-red-500 text-sm">Company name is required.</p>}
//                             </div>

//                             <div className="mb-4">
//                                 <label htmlFor="companyLogo" className="text-left">Company Logo</label><br />
//                                 <input type="file" name="companyLogo" id="companyLogo" accept="image/*"className={`border w-full rounded p-2 ${errors.companyLogo ? 'outline-red-600' : 'outline-none'}`} onChange={(e) => setCompanyLogo(e.target.files[0])} />
//                                 {companyLogo && (
//                                     <div className="mt-2">
//                                         <img src={URL.createObjectURL(companyLogo)} alt="Logo preview" className="w-16 h-16 object-contain border rounded" />
//                                         <p className="text-sm text-gray-600 mt-1">Selected: {companyLogo.name}</p>
//                                     </div>
//                                 )}
//                                 {errors.companyLogo && <p className="text-red-500 text-sm">Company logo is required.</p>}
//                             </div>
//                         </div>
//                     )
//                 }

//                 {errors.submit && <p className="text-red-500 text-sm text-center mb-4">{errors.submit}</p>}

//                 <div className="flex justify-center m-4">
//                     <input type="submit" value={ state === "login" ? "Signin" : "Signup" } className="bg-blue-400 py-1 px-6 rounded-md font-semibold text-white hover:scale-105 cursor-pointer hover:shadow-lg duration-300 ease-in-out w-2/3" />
//                 </div>

//                 <p className="text-center">
//                     {
//                         state === "login" ?
//                         <>Don't have an account? <span className="hover:font-semibold cursor-pointer duration-300 ease-in-out" onClick={handleState}>Sign up</span></> :
//                         <>Already have an account? <span className="hover:font-semibold cursor-pointer duration-300 ease-in-out" onClick={handleState}>Sign in</span></>
//                     }
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default LoginModal;




































import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { FcProcess } from "react-icons/fc";
import { MdError } from "react-icons/md";
import toast from "react-hot-toast";

const LoginModal = (props) => {
    const [state, setState] = useState("login");
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRoleLocal] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyLogo, setCompanyLogo] = useState(null);

    const { setIsLoggedIn, setRole, setUser } = useContext(AuthContext);

    const [errors, setErrors] = useState({});

    const handleState = () => {
        setState(prev => (prev === "login" ? "signup": "login"));
        setErrors({});
        setCompanyName("");
        setCompanyLogo(null);
        setName("");
        setEmail("");
        setPassword("");
        setRoleLocal("");
    }

    const handleRoleChange = (selectedRole) => {
        setRoleLocal(selectedRole);
        if (selectedRole !== "HR") {
            setCompanyName("");
            setCompanyLogo(null);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const newErrors = {
            name: state === "signup" && name.trim() === "",
            email: email.trim() === "" || !/\S+@\S+\.\S+/.test(email),
            password: password.trim() === "" || password.length < 8,
            role: state === "signup" && role === "",
            companyName: state === "signup" && role === "HR" && companyName.trim() === "",
            companyLogo: state === "signup" && role === "HR" && !companyLogo
        };

        setErrors(newErrors);
        
        const hasError = Object.values(newErrors).some(error => error);
        
        if (!hasError) {
            setIsLoading(true);
            
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            
            if (role === "HR") {
                formData.append('companyName', companyName);
                if (companyLogo) {
                    formData.append('companyLogo', companyLogo);
                }
            }

            try {
                if (state === "signup") {
                    const registrationPromise = axios.post("http://localhost:3000/api/register", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    toast.promise(
                        registrationPromise,
                        {
                            loading: 'Creating your account...',
                            success: <b>Registration successful! Please login.</b>,
                            error: <b>Registration failed. Please try again.</b>,
                        }
                    );

                    const response = await registrationPromise;
                    console.log("Signup success:", response.data);
                    
                    setState("login");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setRoleLocal("");
                    setCompanyName("");
                    setCompanyLogo(null);
                } else {
                    const loginPromise = axios.post("http://localhost:3000/api/login", { email, password });

                    toast.promise(
                        loginPromise,
                        {
                            loading: 'Signing in...',
                            success: <b>Logged in successfully!</b>,
                            error: <b>Login failed. Please check your credentials.</b>,
                        }
                    );

                    const response = await loginPromise;
                    console.log("Login success:", response.data);

                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    
                    setUser(response.data.user);
                    setRole(response.data.user.role);
                    setIsLoggedIn(true);
                    props.handleClose();
                }
            } catch (error) {
                console.error("API error:", error.response?.data || error.message);
                setErrors({ submit: error.response?.data?.error || "An error occurred. Please try again." });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <form className={`bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto ${state === "signup" ? "hide-scrollbar" : ""}`} onSubmit={handleSubmit}>
                <button 
                    type="button" 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none disabled:opacity-50" 
                    onClick={props.handleClose}
                    disabled={isLoading}
                >
                    <IoClose className="text-2xl hover:text-red-500 cursor-pointer hover:scale-110" />
                </button>
                
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    { state === "login" ? "Welcome Back" : "Create Account" }
                </h2>
                
                <p className="text-center mb-8 text-gray-500">
                    { state === "login" ? "Sign in to continue your journey" : "Join us today and get started" }
                </p>

                {
                    state === "signup" && (
                        <div className="mb-5">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full name <span className="text-red-600">*</span></label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                className={`border w-full rounded-lg p-3 transition-all ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
                        </div>
                    )
                }

                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address <span className="text-red-600">*</span></label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className={`border w-full rounded-lg p-3 transition-all ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email.</p>}
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-600">*</span></label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        className={`border w-full rounded-lg p-3 transition-all ${errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none`}
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">Password must be 8+ characters with uppercase, lowercase, number, and special symbol.</p>}
                </div>

                {
                    state === "signup" && (
                        <div className="flex flex-col mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">Choose your role <span className="text-red-600">*</span></p>
                            <div className="grid grid-cols-2 gap-3">
                                <div 
                                    className={`border-2 px-4 py-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                                        role === "User" 
                                            ? "bg-blue-50 border-blue-500 shadow-md" 
                                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !isLoading && handleRoleChange("User")}
                                >
                                    <div className="text-3xl mb-2">🎓</div>
                                    <input 
                                        type="radio" 
                                        id="student" 
                                        name="role" 
                                        value="User" 
                                        checked={role === "User"} 
                                        onChange={() => handleRoleChange("User")} 
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="student" className="cursor-pointer text-sm font-medium text-gray-700">Student</label>
                                </div>

                                <div 
                                    className={`border-2 px-4 py-3 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                                        role === "HR" 
                                            ? "bg-blue-50 border-blue-500 shadow-md" 
                                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !isLoading && handleRoleChange("HR")}
                                >
                                    <div className="text-3xl mb-2">💼</div>
                                    <input 
                                        type="radio" 
                                        id="employee" 
                                        name="role" 
                                        value="HR" 
                                        checked={role === "HR"} 
                                        onChange={() => handleRoleChange("HR")} 
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="employee" className="cursor-pointer text-sm font-medium text-gray-700">HR / Employee</label>
                                </div>
                            </div>
                            {errors.role && <p className="text-red-500 text-xs mt-2">Please select your role.</p>}
                        </div>
                    )
                }

                {
                    state === "signup" && role === "HR" && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Company Details</h3>
                            
                            <div className="mb-4">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-600">*</span></label>
                                <input 
                                    type="text" 
                                    name="companyName" 
                                    id="companyName" 
                                    className={`border w-full rounded-lg p-3 transition-all ${errors.companyName ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none bg-white`}
                                    value={companyName} 
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Enter your company name"
                                    disabled={isLoading}
                                />
                                {errors.companyName && <p className="text-red-500 text-xs mt-1">Company name is required.</p>}
                            </div>

                            <div className="mb-0">
                                <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-1">Company Logo <span className="text-red-600">*</span></label>
                                <input 
                                    type="file" 
                                    name="companyLogo" 
                                    id="companyLogo" 
                                    accept="image/*"
                                    className={`border w-full rounded-lg p-3 transition-all ${errors.companyLogo ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'} outline-none bg-white`}
                                    onChange={(e) => setCompanyLogo(e.target.files[0])}
                                    disabled={isLoading}
                                />
                                {companyLogo && (
                                    <div className="mt-3 flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <img 
                                            src={URL.createObjectURL(companyLogo)} 
                                            alt="Logo preview" 
                                            className="w-12 h-12 object-contain border rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-700">{companyLogo.name}</p>
                                            <p className="text-xs text-gray-500">{(companyLogo.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                )}
                                {errors.companyLogo && <p className="text-red-500 text-xs mt-1">Company logo is required.</p>}
                            </div>
                        </div>
                    )
                }

                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm text-center">{errors.submit}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-400 ${
                        isLoading 
                            ? 'bg-blue-300 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg active:scale-[0.98]'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        state === "login" ? "Sign In" : "Create Account"
                    )}
                </button>

                <p className="text-center mt-6 text-sm text-gray-600">
                    {
                        state === "login" ?
                        <>Don't have an account? <button type="button" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer" onClick={handleState} disabled={isLoading}>Sign up</button></> :
                        <>Already have an account? <button type="button" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer" onClick={handleState} disabled={isLoading}>Sign in</button></>
                    }
                </p>
            </form>
        </div>
    );
};

export default LoginModal;