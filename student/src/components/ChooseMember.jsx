import React from 'react'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FlashContext } from '../helpers/FlashContext';
import { AuthContext } from '../helpers/AuthContext';
import { CreateGroupContext } from '../helpers/CreateGroupContext';

function ChooseMember({ onClose }) {
    // const { members, addMember, removeMember } = useContext(MemberContext);
    const { authState } = useContext(AuthContext);
    const { setFlashMessage } = useContext(FlashContext);
    let { classId } = useParams();
    const [members, setMembers] = useState([]);
    const {selectedMembers,setSelectedMembers}= useContext(CreateGroupContext);

    useEffect(() => {
        // You can fetch members from your API here and update the context
        // For this example, we'll assume members are already in the context
        axios.get(`${process.env.REACT_APP_API_URL}/class/${classId}`,
            {
                headers: {
                    "Content-type": "application/json",
                    authorization: `Bearer ${authState.token}`
                }
            }
        ).then((res) => {
            if (res.data.message) {
                setFlashMessage(
                    {
                        status: true,
                        message: res.data.message,
                        heading: "Something went wrong",
                        type: "error"
                    }
                )
            } else {
                setMembers(res.data.students);
            }
        })
    }, []);

    const addMember = (member) => {
        if (selectedMembers.length < 4) {
            if (!selectedMembers.includes(member)) {
                setSelectedMembers([...selectedMembers, member]);
                console.log("Member added:", member);
            } else {
                console.log("Member is already in selectedMembers:", member);
            }
            setMembers((prevMembers) => prevMembers.filter((m) => m !== member));
        }else{
            alert("A group can have maximum of four members")
        }
    };

    const removeMember = (member) => {
        // Check if the member is in selectedMembers
        if(selectedMembers.length > 1){
            if (selectedMembers.includes(member)) {
                // Remove the member from selectedMembers
                setSelectedMembers((prevSelectedMembers) =>
                    prevSelectedMembers.filter((m) => m !== member)
                );

                // Add the member to the members array
                setMembers((prevMembers) => [...prevMembers, member]);

                console.log("Member removed from selectedMembers and added to members:", member);
            } else {
                console.log("Member is not in selectedMembers:", member);
            }
        }else{
            alert("A group must have minimum of 1 member")
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-1/2 h-3/4 p-4 rounded-lg shadow-lg overflow-y-scroll">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Added Members</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        &#x2715;
                    </button>
                </div>
                <ul className="mt-4">
                    <div className="flex space-x-2">
                        {selectedMembers.map((member, index) => (
                            <div key={index} className="relative">
                                <div className="bg-green-400 rounded-full text-white p-2">
                                    {member.name}
                                </div>
                                <button
                                    onClick={() => removeMember(member)}
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 -mt-4 -mr-1"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl font-bold">Choose Members</h2>
                    {members.map((member) => (
                        <li
                            key={member.id}
                            className={"flex items-center justify-between p-2 border-b cursor-pointer"}
                            onClick={() => {
                                addMember(member)
                            }}
                        >
                            {member.name}
                        </li>
                    ))}
                </ul>
                <div className='flex justify-center'>
                    <button  onClick={onClose} className="bg-blue-500 hover:bg-blue-600 mt-10 text-white font-bold py-2 px-4 rounded">
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ChooseMember