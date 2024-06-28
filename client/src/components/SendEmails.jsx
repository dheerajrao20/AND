import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const SendEmails = ({ students }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [sending, setSending] = useState(false); // State to track sending status
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true); // Set sending state to true when submitting
        axios.post('http://localhost:3000/auth/send_emails', { students, subject, message })
            .then(response => {
                if (response.data.Status) {
                    setStatus({ type: 'success', message: 'Emails sent successfully!' });
                } else {
                    setStatus({ type: 'error', message: response.data.Error });
                }
            })
            .catch(err => setStatus({ type: 'error', message: err.message }))
            .finally(() => setSending(false)); // Set sending state back to false after completion
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-md p-8 mt-10 rounded-lg">
            <h3 className="text-xl font-semibold mb-6">Send Emails to Filtered Students</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows="4"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={sending} // Disable button while sending
                >
                    {sending ? 'Sending...' : 'Send Emails'}
                </button>
            </form>
            {status && (
                <div className={`mt-4 ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

SendEmails.propTypes = {
    students: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        CGPA: PropTypes.number,
        branch: PropTypes.string
    })).isRequired
};

export default SendEmails;
