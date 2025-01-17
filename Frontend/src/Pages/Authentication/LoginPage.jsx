import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	EMAIL_PATTERN,
	PASSWORD_PATTERN,
	PASSWORD_REQUIREMENT,
} from "../../config";
import { useFetch } from "../../Contexts/Fetch";
import { UseSetUser } from "../../Contexts/UserContext";
import { useDebounce } from "usehooks-ts";

const fields = {
	email: "",
	password: "",
};

const optionFields = {
	showPassword: false,
	validEmail: {
		valid: false,
		showErr: false,
	},
	validPassword: {
		valid: false,
		showErr: false,
	},
};

const LoginPage = () => {
	const CustomFetch = useFetch();
	const setUser = UseSetUser();
	const Navigate = useNavigate();
	const { state } = useLocation();
	const [err, setErr] = useState(null);
	const [formSubmittable, setFormSubmittable] = useState(false);
	const [loginDetails, setLoginDetails] = useState(fields);
	const [options, setOptions] = useState(optionFields);
	const debounceValue = useDebounce(loginDetails, 1000);

	// Automatically prefill data, if user came from register page with prefilled form.
	useEffect(() => {
		if (state) {
			setLoginDetails((prevValue) => {
				return {
					...prevValue,
					...state,
				};
			});
		}
	}, [state]);

	const resetForm = () => {
		setLoginDetails(fields);
	};

	// Update user state
	const handleLoginDetails = (type, newValue) => {
		setLoginDetails((prevValue) => {
			return {
				...prevValue,
				[`${type}`]: newValue,
			};
		});
	};

	// Update options state
	const updateOptions = ({ type, property, value, PATTERN }) => {
		// Updates the showPassword value.
		if (type === "password") {
			setOptions((prevValue) => {
				return {
					...prevValue,
					showPassword: value,
				};
			});
		} else {
			// Added this so It is possible to tell the code that the current credentials aren't valid, but don't show the error yet. In cases where the user hasn't provided any value we wouldn't want to show an erorr, but the password isn't valid either.
			if (property.length === 0) {
				// If there's no password for example, it sets the showErr variable to false, and valid to false.
				setOptions((prevValue) => {
					return {
						...prevValue,
						[`${value}`]: {
							showErr: false,
							valid: false,
						},
					};
				});
			} else if (PATTERN.test(property)) {
				// It tests the inputted value for example, the password with the password pattern, and checks if its valid. If it is, valid gets set to ture, and showErr is set to false.
				setOptions((prevValue) => {
					return {
						...prevValue,
						[`${value}`]: {
							showErr: false,
							valid: true,
						},
					};
				});
			} else {
				setOptions((prevValue) => {
					// This only gets executed when there is a value, and the value does not match the regex pattern provided. It sets showErr to true, and valid to false.
					return {
						...prevValue,
						[`${value}`]: {
							showErr: true,
							valid: false,
						},
					};
				});
			}
		}
	};

	// Runs on every render, and check if the email, and password is valid or not, while setting the state accordingly.
	useEffect(() => {
		updateOptions({
			property: loginDetails.email,
			value: "validEmail",
			PATTERN: EMAIL_PATTERN,
		});
		updateOptions({
			property: loginDetails.password,
			value: "validPassword",
			PATTERN: PASSWORD_PATTERN,
		});
	}, [debounceValue]);

	// Updates the formSubmittable state, couldn't have this code along with the code above due to state taking time before it applies the changes.
	useEffect(() => {
		options.validEmail.valid
			? setFormSubmittable(true)
			: setFormSubmittable(false);
	});

	// Tries logging in the user, and if successful redirects back to the main page.
	const handleLogin = async (e) => {
		e.preventDefault();
		if (!formSubmittable) return;
		const { data, response } = await CustomFetch({
			url: "login",
			options: {
				method: "POST",
				body: JSON.stringify({
					email: loginDetails.email,
					password: loginDetails.password,
				}),
			},
			returnResponse: true,
		});

		if (response.ok) {
			// Reset login form and Navigate to the main page.
			setErr(null);
			setUser({
				isAuthenticated: true,
				id: data.id,
				username: data.username,
			});
			resetForm();
			Navigate("/", {
				replace: true,
			});
		} else {
			setErr(data.err);
		}
	};

	return (
		<div className="">
			<div className="border-solid border-[1px] drop-shadow-md overflow-hidden border-slate-300 mt-20 rounded-md max-w-md m-auto">
				<div className="bg-indigo-500 p-4 text-center text-white">
					<h2 className="text-2xl font-bold">Login</h2>
				</div>
				<form className="flex flex-col p-4 gap-4 bg-white">
					<div className="flex flex-col">
						<label
							htmlFor="email"
							className="text-indigo-500 font-medium text-2xl">
							Email
						</label>
						<input
							className="bg-indigo-100 rounded-md p-2 border-[1px] outline-indigo-500"
							id="email"
							value={loginDetails.email}
							onChange={(e) =>
								handleLoginDetails(
									"email",
									e.currentTarget.value
								)
							}
							type="email"
							placeholder=""
						/>
						<span
							className={`text-red-600 text-sm font-normal w-full mx-1 ${
								options.validEmail.showErr ? "block" : "hidden"
							}`}>
							Kindly please provide a valid email.
						</span>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor="password"
							className="text-indigo-500 font-medium text-2xl">
							Password
						</label>
						<div className="flex w-full items-center gap-2">
							<input
								className="bg-indigo-100 rounded-md p-2 border-[1px] border-slate-200 outline-indigo-500 w-full"
								value={loginDetails.password}
								onChange={(e) =>
									handleLoginDetails(
										"password",
										e.currentTarget.value
									)
								}
								id="password"
								type={
									options.showPassword ? "text" : "password"
								}
							/>

							{options.showPassword ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-8 hover:cursor-pointer text-indigo-700"
									onClick={() =>
										updateOptions({
											type: "password",
											value: false,
										})
									}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-8 hover:cursor-pointer text-indigo-700"
									onClick={() =>
										updateOptions({
											type: "password",
											value: true,
										})
									}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							)}
						</div>
						<span
							className={`text-red-700 text-sm font-normal w-full mx-1 ${
								options.validPassword.showErr
									? "block"
									: "hidden"
							}`}>
							{PASSWORD_REQUIREMENT}
						</span>
					</div>
					{err && (
						<p className="w-full text-center text-red-500">{err}</p>
					)}
					<div className="flex flex-col gap-1 mt-2  items-center">
						<span className="text-gray-500 cursor-default">
							Don't have an account?
							<Link
								className="text-indigo-500 hover:text-indigo-700 duration-300"
								to="../register"
								state={loginDetails}>
								{" "}
								Register Here
							</Link>
						</span>
						<button
							className={`duration-300 text-white py-2 px-8 text-medium rounded-md cursor-pointer ${
								formSubmittable
									? "bg-indigo-500 hover:bg-indigo-700"
									: "bg-gray-500 "
							}`}
							onClick={handleLogin}>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
