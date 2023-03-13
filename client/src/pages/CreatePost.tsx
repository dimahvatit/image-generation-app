import React, {ChangeEvent, FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {preview} from "../assets";
import {getRandomPrompt} from "../utils";
import {Loader, FormField} from "./../components";

const CreatePost = () => {
    const navigation = useNavigate();
    const [form, setForm] = useState({
        name: "",
        prompt: "",
        photo: "",
    });
    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        console.log("Form submitted", event);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSurpriseMe = (): void => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({...form, prompt: randomPrompt});
    };

    const generateImage = async () => {
        if(form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await fetch("http://127.0.0.1:8080/api/v1/dalle", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ prompt: form.prompt })
                });

                const data = await response.json();

                setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}`})
            } catch (err) {
                console.log(err);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert("Please enter a prompt");
        }
    };

    return (
        <section className="max-w-7x1 mx-auto">
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-extrabold text-[#222328] text-[32px]">
                    Create
                </h1>
                <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
                    Create imaginative and visually stunning images through DALL-E AI and share them with the community
                </p>
            </div>

            <form className="mt-16 max-w-3x1 " onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="Your name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        handleChange={handleChange}
                    />
                    <FormField
                        labelName="Your prompt"
                        type="text"
                        name="prompt"
                        placeholder="A plush toy robot sitting against a yellow wall"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />
                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900
						text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64
						flex justify-center items-center">
                        {form.photo ? (
                            <img src={form.photo}
                                 alt={form.prompt}
                                 className="w-full h-full object-contain"
                            />
                        ) : (
                            <img src={preview}
                                 alt="preview"
                                 className="w-9/12 h-9/12 object-contain opacity-40"
                            />
                        )}

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center items-center
								bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader/>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-5 flex gap-5">
                    <button type="button"
                            onClick={generateImage}
                            disabled={generatingImg}
                            className="text-white bg-green-700 font-medium
                            rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center
                            hover:bg-green-600 active:bg-green-800 transition background-color">
                        {generatingImg ? "Generating..." : "Generate"}
                    </button>
                </div>

                <div className="mt-10 text-left">
                    <p className="mt-2 text-[#666e75] text-[14px]">Once you have created the image you want,
                        you can share it with others in the community</p>
                    <button type="submit"
                            className="mt-3 text-white bg-[#6469ff] font-medium
                            rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center
                            hover:bg-[#797efc] active:bg-[#3941fa] transition background-color">
                        {loading ? "Sharing..." : "Share"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreatePost;
