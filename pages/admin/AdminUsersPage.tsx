
import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, TestResult } from '../../types';
import { PlusIcon } from '../../components/Icon';

const AdminUsersPage: React.FC = () => {
    const { registeredUsers, testResults, createAdmin } = useContext(AuthContext);
    const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const usersWithDetails = useMemo(() => registeredUsers.map(user => {
        const userResult = testResults.find(r => r.userEmail === user.email && r.course === user.course);
        const resultIndex = userResult ? testResults.indexOf(userResult) : -1;
        return { ...user, result: userResult, resultIndex };
    }), [registeredUsers, testResults]);

    const filteredUsers = useMemo(() => {
        return usersWithDetails.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [usersWithDetails, searchTerm, roleFilter]);

    const handleCreateAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
            setError("All fields are required.");
            return;
        }
        if (registeredUsers.some(u => u.email === newAdmin.email) || newAdmin.email === 'kalyanpradhan275@gmail.com') {
            setError("An account with this email already exists.");
            return;
        }
        createAdmin(newAdmin);
        setShowCreateAdminForm(false);
        setNewAdmin({ name: '', email: '', password: '' });
    };

    const inputClass = "w-full px-3 py-2 bg-neutral-100 border border-neutral-300 rounded-md text-dark focus:ring-2 focus:ring-primary focus:outline-none";

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-dark">Registered Users ({filteredUsers.length})</h1>
                 <button onClick={() => {setError(''); setShowCreateAdminForm(true);}} className="flex items-center justify-center bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors shrink-0">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Admin
                </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={inputClass}
                    />
                     <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className={inputClass}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {showCreateAdminForm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100">
                        <h2 className="text-2xl font-bold text-dark mb-4">Create New Admin Profile</h2>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                        <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
                                <input type="text" value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} className={inputClass} required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
                                <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} className={inputClass} required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-dark-700 mb-1">Password</label>
                                <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} className={inputClass} required />
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={() => setShowCreateAdminForm(false)} className="py-2 px-6 bg-neutral-200 text-dark font-semibold rounded-md hover:bg-neutral-300">Cancel</button>
                                <button type="submit" className="py-2 px-6 bg-primary text-white font-bold rounded-md hover:bg-primary-dark">Create Admin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-100">
                            <tr>
                                <th className="p-4 font-semibold text-dark">Name</th>
                                <th className="p-4 font-semibold text-dark">Contact</th>
                                <th className="p-4 font-semibold text-dark">Role</th>
                                <th className="p-4 font-semibold text-dark">Course</th>
                                <th className="p-4 font-semibold text-dark">Test Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user: User & {result?: TestResult, resultIndex: number}, index: number) => (
                                <tr key={user.email} className={`border-t border-neutral-200 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-100/50'}`}>
                                    <td className="p-4 align-top">
                                        <p className="font-semibold text-dark">{user.name}</p>
                                        <p className="text-dark-700">{user.email}</p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-dark-700">{user.phone}</p>
                                        <p className="text-dark-700 text-xs mt-1">{user.fullAddress}</p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-sky-100 text-sky-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top text-dark-700">{user.course || 'N/A'}</td>
                                    <td className="p-4 align-top">
                                        {user.role === 'student' && user.result ? (
                                            <div>
                                                <p className="font-bold text-primary">{user.result.score} / {user.result.totalQuestions}</p>
                                                <p className="text-green-600 font-semibold">{user.result.discount}% Discount</p>
                                                <p className="text-xs text-dark-700 mt-1">{new Date(user.result.date).toLocaleDateString()}</p>
                                                {user.resultIndex > -1 && (
                                                    <Link to={`/admin/test-result/${user.resultIndex}`} className="text-sm font-medium text-primary hover:text-primary-dark hover:underline mt-2 inline-block">
                                                        View Answers
                                                    </Link>
                                                )}
                                            </div>
                                        ) : user.role === 'student' ? (
                                            <span className="text-dark-700 italic">Not taken yet</span>
                                        ) : (
                                            <span className="text-dark-700">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-dark-700">No users match the current filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;