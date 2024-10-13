import React from "react";

const AuthFooter = () => {
    return (
        <div className="bg-[#383333] p-4 text-white hidden lg:flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:mx-14">
                <div className="flex flex-col md:flex-row space-x-6 items-start md:items-end">
                    <div>{/* LOGO HERE, SIZE 50 */}</div>
                    <div className="flex flex-col mb-2 md:mb-0">
                        <p className="font-semibold text-[14px]">
                            UNIVERSITY OF NUEVA CACERES
                        </p>
                        <p className="font-semibold text-[14px]">
                            J. Hernandez Avenue, Naga City 4400
                        </p>
                    </div>
                    <div className="flex flex-row items-end ml-4 justify-center mb-2 md:mb-0">
                        <p className="font-semibold text-[12px]">09100210141</p>
                        <p className="font-semibold text-[12px]">
                            | 09119823812
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row space-x-6">
                    <div className="flex flex-col mb-2 md:mb-0 pl-6 md:pl-0">
                        <p className="font-semibold text-[14px]">
                            info@unc.edu.ph
                        </p>
                        <p className="font-semibold text-[14px]">
                            admission@unc.edu.ph
                        </p>
                    </div>
                    <div className="mb-2 md:mb-0">
                        <p>Follow Us</p>
                        <div className="flex flex-row space-x-4">
                            <a className="fab fa-facebook" href="#"></a>
                            <a className="fab fa-twitter" href="#"></a>
                            <a className="fab fa-instagram" href="#"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthFooter;
