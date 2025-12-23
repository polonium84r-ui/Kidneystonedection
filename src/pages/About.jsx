import { FaFileMedical, FaUpload, FaBrain, FaEye, FaArrowRight } from 'react-icons/fa'

const About = () => {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-clean border border-slate-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-medical p-12 text-center text-white">
                        <FaFileMedical className="mx-auto text-6xl mb-6 opacity-90" />
                        <h1 className="text-4xl font-bold mb-4">About the System</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Advanced Kidney Stone Detection System utilizing AI for rapid and accurate diagnosis.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-10 space-y-12">
                        {/* Mission */}
                        <div className="text-center max-w-3xl mx-auto animate-fade-in">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To empower medical professionals with state-of-the-art AI technology, enhancing the speed and accuracy of kidney stone detection, ultimately improving patient outcomes and streamlining clinical workflows.
                            </p>
                        </div>

                        {/* How It Works Section */}
                        <div className="py-8 animate-fade-in border-t border-b border-slate-100 my-8">
                            <h2 className="text-3xl font-bold text-center text-slate-800 mb-3">How It Works</h2>
                            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
                                Our AI-powered system provides comprehensive analysis of renal imaging to help medical professionals make informed decisions
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Step 1 */}
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
                                        <FaUpload className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">Upload Scan</h3>
                                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                        Upload your CT KUB or renal scans in various formats (JPG, PNG, DICOM) for instant processing
                                    </p>

                                </div>

                                {/* Step 2 */}
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-purple-200">
                                        <FaBrain className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">Run AI Analysis</h3>
                                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                        Leverage advanced AI models (YOLOv11n) to detect kidney stones, obstruction risks, and calculate measurements
                                    </p>

                                </div>

                                {/* Step 3 */}
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-teal-200">
                                        <FaEye className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">View Results</h3>
                                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                        Compare original vs processed images with detailed clinical measurements and AI insights
                                    </p>

                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Footer / Contact */}
                    <div className="border-t border-slate-100 pt-8 text-center">


                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
