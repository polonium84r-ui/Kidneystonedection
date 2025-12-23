import { FaQuoteLeft } from 'react-icons/fa'

const TestimonialFooter = () => {
    const testimonials = [
        {
            name: 'Aravindan',
            role: 'UI Designer',
            quote: 'Designing for clarity and trust in medical AI.',
            initials: 'AD'
        },
        {
            name: 'Ashwin Karthik',
            role: 'Frontend Developer',
            quote: 'Building seamless interactions for healthcare professionals.',
            initials: 'AK'
        },
        {
            name: 'Devaprakash',
            role: 'Backend Developer',
            quote: 'Ensuring secure and rapid medical data processing.',
            initials: 'DP'
        }
    ]

    return (
        <footer className="w-full bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h3 className="text-xl font-bold text-gray-800">Meet The Team</h3>
                    <p className="text-gray-500 text-sm mt-1">Advanced Medical Imaging Analysis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((person, index) => (
                        <div
                            key={index}
                            className="group relative bg-[#f8fafc] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white border border-transparent hover:border-medical-blue/20"
                        >


                            <div className="flex items-center space-x-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-medical flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {person.initials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{person.name}</h4>
                                    <p className="text-xs font-semibold text-medical-blue uppercase tracking-wider">{person.role}</p>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm italic relative z-10 leading-relaxed">
                                "{person.quote}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12 pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Kidney Stone Detection System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default TestimonialFooter
