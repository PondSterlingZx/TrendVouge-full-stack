import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import Body3DVisualizer from './3D/BodyModel.jsx';

const questions = [
    {
        id: 'bodyType',
        question: 'What is your body type?',
        options: ['Hourglass', 'Pear', 'Rectangle', 'Apple', 'Athletic']
    },
    {
        id: 'measurements',
        question: 'Lets get your measurements',
        type: 'measurements'
    },
    {
        id: 'fitPreference',
        question: 'How do you prefer your clothes to fit?',
        options: ['Tight', 'Regular', 'Loose']
    }
];

const calculateSize = (answers) => {
    // Basic size calculation logic
    const { bust, waist, hip } = answers.measurements || {};
    
    // Simple size calculation based on measurements
    const averageMeasurement = (bust + waist + hip) / 3;
    
    if (averageMeasurement < 80) return 'XS';
    if (averageMeasurement < 88) return 'S';
    if (averageMeasurement < 96) return 'M';
    if (averageMeasurement < 104) return 'L';
    return 'XL';
};

const SizeRecommendationQuiz = ({ userId, onSizeRecommended }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [recommendedSize, setRecommendedSize] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [loading, setLoading] = useState(true);
    const [measurements, setMeasurements] = useState({
        bust: 50,
        waist: 50,
        hip: 50
    });

    // Previous loadSavedRecommendation and saveRecommendation functions remain the same...

    const handleAnswer = async (answer) => {
        let newAnswers = { ...answers };
        
        if (questions[step].type === 'measurements') {
            newAnswers = { ...newAnswers, measurements };
        } else {
            newAnswers = { ...newAnswers, [questions[step].id]: answer };
        }
        
        setAnswers(newAnswers);

        if (step === questions.length - 1) {
            const newSize = calculateSize(newAnswers);
            setRecommendedSize(newSize);
            onSizeRecommended(newSize);
            await saveRecommendation(newAnswers, newSize);
            setShowQuiz(false);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const renderQuizContent = () => {
        const currentQuestion = questions[step];

        if (currentQuestion.type === 'measurements') {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                        <Body3DVisualizer measurements={measurements} />
                        
                        <div className="space-y-4">
                            {Object.entries(measurements).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-sm font-medium capitalize">
                                        {key} (cm)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="40"
                                            max="140"
                                            value={value}
                                            onChange={(e) => setMeasurements(prev => ({
                                                ...prev,
                                                [key]: parseInt(e.target.value)
                                            }))}
                                            className="flex-1"
                                        />
                                        <span className="w-12 text-sm">{value}cm</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => handleAnswer(measurements)}
                        className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <h3 className="font-medium text-lg">{currentQuestion.question}</h3>
                <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="p-3 border rounded-lg hover:bg-gray-50"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div>Loading saved size recommendation...</div>;
    }

    return (
        <div className="mb-6">
            {recommendedSize ? (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm">Your saved size recommendation:</p>
                    <p className="font-medium">Size {recommendedSize}</p>
                    <button
                        onClick={() => {
                            setShowQuiz(true);
                            setStep(0);
                            setRecommendedSize(null);
                        }}
                        className="text-blue-600 text-sm underline mt-2"
                    >
                        Retake Quiz
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowQuiz(true)}
                    className="text-blue-600 underline"
                >
                    Not sure about your size? Take our quiz!
                </button>
            )}

            {showQuiz && (
                <div className="mt-6 p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-medium">Size Recommendation Quiz</h2>
                        <div className="text-sm text-gray-500">
                            Step {step + 1} of {questions.length}
                        </div>
                    </div>
                    {renderQuizContent()}
                </div>
            )}
        </div>
    );
};

export default SizeRecommendationQuiz;