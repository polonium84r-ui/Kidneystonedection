import { Link } from 'react-router-dom'
import { FaUpload, FaBrain, FaEye, FaArrowRight, FaInfoCircle } from 'react-icons/fa'

const About = () => {
    const features = [
        {
            icon: FaUpload,
            title: 'Upload Angio Image',
            description: 'Upload your angiography or blood vessel images in various formats (JPG, PNG, DICOM)',
            gradient: 'from-medical-blue to-medical-cyan',
            link: '/upload',
        },
        {
            icon: FaBrain,
            title: 'Run AI Analysis',
            description: 'Leverage advanced AI models powered by Roboflow to detect blockages and anomalies',
            gradient: 'from-medical-purple to-medical-pink',
            link: '/upload',
        },
        {
            icon: FaEye,
            title: 'View Detection Results',
            description: 'Compare original vs processed images with detailed analysis and medical insights',
            gradient: 'from-medical-teal to-medical-cyan',
            link: '/analysis',
        },
    ]

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex p-4 rounded-full bg-blue-100 text-medical-blue mb-6">
                        <FaInfoCircle className="text-4xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">About The System</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Our Heart Angiography Detection System leverages cutting-edge artificial intelligence to assist medical professionals in identifying and analyzing vascular conditions.
                    </p>
                </div>

                {/* How It Works Section (Moved from Dashboard) */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our AI-powered system provides comprehensive analysis of angiography images
                            to help medical professionals make informed decisions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <Link
                                    key={index}
                                    to={feature.link}
                                    className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border-2 border-transparent hover:border-medical-blue/30"
                                >
                                    {/* Gradient Background on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                                    <div className="relative z-10">
                                        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="text-3xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                        <div className="mt-6 flex items-center text-medical-blue font-medium group-hover:translate-x-2 transition-transform duration-300">
                                            <span>Learn more</span>
                                            <FaArrowRight className="ml-2" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 border-2 border-medical-blue/10">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We aim to democratize access to advanced vascular diagnostics by providing an accessible, high-performance AI tool that supports cardiologists and radiologists in their daily workflow.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                By automating detection tasks, we allow medical professionals to focus more on patient care and treatment planning, ultimately improving patient outcomes.
                            </p>
                        </div>
                        <div className="bg-gradient-medical p-12 flex items-center justify-center text-white">
                            <div className="text-center">
                                <div className="text-6xl font-bold mb-4">AI + MD</div>
                                <p className="text-xl opacity-90">Combining Artificial Intelligence</p>
                                <p className="text-xl opacity-90">with Medical Expertise</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
