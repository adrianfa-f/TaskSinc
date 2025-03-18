import React from 'react';

const testimonials = [
        {
            username: 'JuanPérez123',
            rating: 5,
            comment: '¡Esta plataforma es increíble! Ha mejorado mi productividad enormemente.',
        },
        {
            username: 'MariaGonzalez456',
            rating: 4,
            comment: 'Muy útil y fácil de usar. La recomiendo a todos mis colegas.',
        },
        {
            username: 'CarlosRamirez789',
            rating: 5,
            comment: 'Fantástica herramienta para gestionar mis tareas diarias. ¡Excelente trabajo!',
        },
    ];

    const StarRating = ({ rating }) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
                    &#9733;
                </span>
            );
        }
        return <div className="flex justify-center">{stars}</div>;
    };

const Testimonials = () => {
    return (
        <div className="testimonial-section text-center bg-gray-100 py-12 px-4">
            <h2 className="text-3xl font-bold mb-8">Testimonios</h2>
            <div className="space-y-8 sm:space-y-0 sm:flex">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial bg-white border border-gray-200 rounded-lg p-6 shadow-md mx-2 max-w-xl">
                        <h3 className="text-xl font-semibold mb-2">{testimonial.username}</h3>
                        <StarRating rating={testimonial.rating} />
                        <p className="mt-4 text-gray-600">{testimonial.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;