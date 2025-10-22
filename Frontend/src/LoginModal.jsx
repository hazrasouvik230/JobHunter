import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

const LoginModal = (props) => {
    const [state, setState] = useState("login");

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
            password: password.trim() === "" || password.length < 4,
            role: state === "signup" && role === "",
            companyName: state === "signup" && role === "HR" && companyName.trim() === "",
            companyLogo: state === "signup" && role === "HR" && !companyLogo
        };

        setErrors(newErrors);
        
        const hasError = Object.values(newErrors).some(error => error);
        
        if (!hasError) {
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
            
            console.log(formData);

            try {
                if (state === "signup") {
                    const response = await axios.post("http://localhost:3000/api/register", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log("Signup success:", response.data);
                    
                    setState("login");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setRoleLocal("");
                    setCompanyName("");
                    setCompanyLogo(null);
                } else {
                    const response = await axios.post("http://localhost:3000/api/login", { email, password });
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
                setErrors({ submit: "An error occured. Please try again." });
            }

        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form className="bg-white w-11/12 sm:w-2/3 md:w-2/3 lg:w-1/3 p-8 pt-12 pb-12 rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit}>
                <button type="button" className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800 focus:outline-none" onClick={props.handleClose}>&times;</button>
                
                <p className="font-bold text-center mb-2">{ state === "login" ? "Sign in to your account" : "Create your account" }</p>
                
                <p className="font-thin text-center mb-4">{ state === "login" ? "Welcome back! Please sign in to continue" : "Hi! Please sign up to continue" }</p>

                {
                    state === "signup" && (
                        <div className="mb-4">
                            <label htmlFor="name" className="text-left">Full name</label><br />
                            <input type="text" name="name" id="name" className={`border w-full rounded p-2 required:border-red-500 ${errors.name ? 'outline-red-600' : 'outline-none'}`} value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name && <p className="text-red-500 text-sm">Name is required.</p>}
                        </div>
                    )
                }

                <div className="mb-4">
                    <label htmlFor="email" className="text-left">Email address</label><br />
                    <input type="email" name="email" id="email" className={`border w-full rounded p-2 required:border-red-500 ${errors.email ? 'outline-red-600' : 'outline-none'}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-red-500 text-sm">Please enter a valid email.</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password">Password</label><br />
                    <input type="password" name="password" id="password" className={`border w-full rounded p-2 required:border-red-500 ${errors.password ? 'outline-red-600' : 'outline-none'}`} value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-red-500 text-sm">Password must be at least 4 characters.</p>}
                </div>

                {
                    state === "signup" && (
                        <div className="flex flex-col mb-6">
                            <p className="mb-1">Choose your role</p>
                            <div className="flex items-center justify-between">
                                <div className={`border px-6 py-2 rounded flex items-center justify-center gap-2 cursor-pointer duration-300 ease-in-out ${role === "User" ? "bg-blue-100 border-blue-500 shadow-md scale-105" : "hover:bg-gray-300/50 hover:scale-105 hover:shadow-lg"}`} onClick={() => handleRoleChange("User")}>
                                    <input type="radio" id="student" name="role" value="User" checked={role === "User"} onChange={() => handleRoleChange("User")} className="hidden" />
                                    <label htmlFor="student" className="cursor-pointer">Become a Student</label>
                                </div>

                                <div className={`border px-6 py-2 rounded flex items-center justify-center gap-2 cursor-pointer duration-300 ease-in-out ${role === "HR" ? "bg-blue-100 border-blue-500 shadow-md scale-105" : "hover:bg-gray-300/50 hover:scale-105 hover:shadow-lg"}`} onClick={() => handleRoleChange("HR")}>
                                    <input type="radio" id="employee" name="role" value="HR" checked={role === "HR"} onChange={() => handleRoleChange("HR")} className="hidden" />
                                    <label htmlFor="employee" className="cursor-pointer">Become an Employee</label>
                                </div>
                            </div>
                            {errors.role && <p className="text-red-500 text-sm">Please select your role.</p>}
                        </div>
                    )
                }

                {
                    state === "signup" && role === "HR" && (
                        <div className="mb-6">
                            <div className="mb-4">
                                <label htmlFor="companyName" className="text-left">Company Name</label><br />
                                <input type="text" name="companyName" id="companyName" className={`border w-full rounded p-2 ${errors.companyName ? 'outline-red-600' : 'outline-none'}`} value={companyName} onChange={(e) => setCompanyName(e.target.value)}placeholder="Enter your company name" />
                                {errors.companyName && <p className="text-red-500 text-sm">Company name is required.</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="companyLogo" className="text-left">Company Logo</label><br />
                                <input type="file" name="companyLogo" id="companyLogo" accept="image/*"className={`border w-full rounded p-2 ${errors.companyLogo ? 'outline-red-600' : 'outline-none'}`} onChange={(e) => setCompanyLogo(e.target.files[0])} />
                                {companyLogo && (
                                    <div className="mt-2">
                                        <img src={URL.createObjectURL(companyLogo)} alt="Logo preview" className="w-16 h-16 object-contain border rounded" />
                                        <p className="text-sm text-gray-600 mt-1">Selected: {companyLogo.name}</p>
                                    </div>
                                )}
                                {errors.companyLogo && <p className="text-red-500 text-sm">Company logo is required.</p>}
                            </div>
                        </div>
                    )
                }

                {errors.submit && <p className="text-red-500 text-sm text-center mb-4">{errors.submit}</p>}

                <div className="flex justify-center m-4">
                    <input type="submit" value={ state === "login" ? "Signin" : "Signup" } className="bg-blue-400 py-1 px-6 rounded-md font-semibold text-white hover:scale-105 cursor-pointer hover:shadow-lg duration-300 ease-in-out w-2/3" />
                </div>

                <p className="text-center">
                    {
                        state === "login" ?
                        <>Don't have an account? <span className="hover:font-semibold cursor-pointer duration-300 ease-in-out" onClick={handleState}>Sign up</span></> :
                        <>Already have an account? <span className="hover:font-semibold cursor-pointer duration-300 ease-in-out" onClick={handleState}>Sign in</span></>
                    }
                </p>
            </form>
        </div>
    );
};

export default LoginModal;