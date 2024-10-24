import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Details = () => {
    const [data, setdata] = useState([]); // Displayed data (after filtering)
    const [originalData, setOriginalData] = useState([]); // Unfiltered original data
    const [state, setstate] = useState('Add');
    const [id, setid] = useState('');
    const [search, setsearch] = useState('');
    const [authordata, setauthordata] = useState({
        id: '',
        title: '',
        comments: '',
        likes: '',
        author: ''
    });
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

    // Function to add new post
    const adddata = async () => {
        const response = await axios.post('http://localhost:3000/posts', authordata);
        console.log(response.data);
    };

    const fetchdata = async () => {
        const response = await axios.get('http://localhost:3000/posts');
        setdata(response.data);  // Set both data and originalData initially
        setOriginalData(response.data);
    };
    // Fetch data on component mount
    useEffect(() => {
        fetchdata();
    }, []);
    
    

    // Submit handler for the form
    const submitHandler = (e) => {
        e.preventDefault();
        if(authordata.id==='' || authordata.title==='' || authordata.comments===''|| authordata.likes===''|| authordata.author=='')
        {
            alert("Fill the blank space");
            return;
        }
        if(state==="Add") {
            adddata();
            fetchdata();
            setauthordata({
                id: '',
                title: '',
                comments: '',
                likes: '',
                author: ''
            })
        } else {
            updatepost(id);
            fetchdata();
            setauthordata({
                id: '',
                title: '',
                comments: '',
                likes: '',
                author: ''
            })
        }
    };

    // Handle form field changes
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setauthordata((prevdata) => {
            return { ...prevdata, [name]: value };
        });
    };

    // Function to delete a post by ID
    const deletepost = async (id) => {
        const response = await axios.delete(`http://localhost:3000/posts/${id}`);
        console.log(response.data);
        const updatedData = data.filter(d => d.id !== id);
        setdata(updatedData);
        setOriginalData(updatedData); // Update original data as well
        fetchdata();
    };

    // Function to handle the edit action
    const edithandler = (id) => {
        const postToEdit = data.find(d => d.id === id);
        if (postToEdit) {
            setauthordata(postToEdit);
            setstate("Edit");
            setid(id);
        }
    };

    // Function to update an existing post
    const updatepost = async (id) => {
        const response = await axios.put(`http://localhost:3000/posts/${id}`, authordata);
        console.log(response.data);
        const updatedData = data.map(d => (d.id === id ? response.data : d));
        setdata(updatedData);
        setOriginalData(updatedData); // Update original data as well
    };

    // Handle the select change for Edit/Delete actions
    const handleselectchange = (e, id1) => {
        const selectedValue = e.target.value;
        if (selectedValue === "Edit") {
            edithandler(id1);
        } else if (selectedValue === "Delete") {
            deletepost(id1);
        }
    };

    // Handle search and filter the data
    // Handle search and filter the data
const hanelesubmit2 = (e) => {
    e.preventDefault();
    console.log('inside');
    
    if (search === '') {
        // Reset to original data if search is cleared
        setdata(originalData);
    } else {
        const filteredData = originalData.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) || 
            item.author.toLowerCase().includes(search.toLowerCase())
        );
        console.log("Filtered Data:", filteredData); // Log filtered data
        setdata(filteredData);
    }
};


    // Function to sort data by ID
    const sortById = () => {
        const sortedData = [...data].sort((a, b) => {
            return sortOrder === 'asc' ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id);
        });
        setdata(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };
    // const sortByName = () => {
    //     const sortedData = [...data].sort((a, b) => {
    //       if (a.title < b.title) {
    //         return -1;
    //       }
    //       if (a.title > b.title) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     setdata(sortedData);
    //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort orde
    // }
    

    return (
        <>
            <form onSubmit={hanelesubmit2}>
            <h1 className='text-[2rem]'>Search</h1>
                <input type="text" name="" id="" className='border' value={search} onChange={(e)=>setsearch(e.target.value)}/>
                <button type="submit" className='border ml-4 m-2 p-2'>Search</button>
            </form><br/>
            <form action="" method="post" onSubmit={submitHandler} className='border'>
            <h1 className='text-[2rem]'>Form</h1>
            <div className='flex justify-center items-center'>
            <div className="id m-2 p-2">
            <span className='m-2 p-2'>id:</span>  <input type="text" name="id" className='border' value={authordata.id} onChange={changeHandler} /><br />
            </div>
                <div className="title  m-2 p-2">
                <spand className="m-2 p-2">Title:</spand> <input type="text" name="title" value={authordata.title} className='border' onChange={changeHandler} /><br />
                </div>
                <div className="comments m-2 p-2">
               <span className="m-2 p-2">Comments:</span>  <input type="number" name="comments" value={authordata.comments} className='border' onChange={changeHandler} /><br />
                </div>
                <div className="likes m-2 p-2">
               <span className="m-2 p-2">likes:</span> <input type="number" name="likes" value={authordata.likes} className='border' onChange={changeHandler} /><br />
                </div>
                
                <div className="author m-2 p-2">
               <span className="m-2 p-2">author :</span> <input type="text" name="author" value={authordata.author} className='border' onChange={changeHandler} /><br />
                </div>
            </div>
            
                <button type="submit" className='border m-2 p-2 px-5'>{state}</button>
            </form>

            <h1 className='text-[2rem] mt-3'>All Data</h1>
            <table style={{ border: "2px solid black", width: "100%", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th style={{ border: "2px solid black", padding: "10px" }}>
                            <span onClick={sortById} style={{ cursor: 'pointer' }}>
                                id {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                        </th>
                        <th style={{ border: "2px solid black", padding: "10px" }}>Title</th>
                        <th style={{ border: "2px solid black", padding: "10px" }}>Comments</th>
                        <th style={{ border: "2px solid black", padding: "10px" }}>likes</th>
                        <th style={{ border: "2px solid black", padding: "10px" }}>author</th>
                        <th style={{ border: "2px solid black", padding: "10px" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.id}>
                            <td style={{ border: "2px solid black", padding: "10px" }}>{d.id}</td>
                            <td style={{ border: "2px solid black", padding: "10px" }}>{d.title}</td>
                            <td style={{ border: "2px solid black", padding: "10px" }}>{d.comments}</td>
                            <td style={{ border: "2px solid black", padding: "10px" }}>{d.likes}</td>
                            <td style={{ border: "2px solid black", padding: "10px" }}>{d.author}</td>
                            <td style={{ border: "2px solid black", padding: "10px" }}>
                                <select name="action" onChange={(e) => handleselectchange(e, d.id)}>
                                    <option value="Select">Select</option>
                                    <option value="Edit">Edit</option>
                                    <option value="Delete">Delete</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Details;
