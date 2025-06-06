import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLoan,getUserLoans,updateLoanStatus,getAllLoans } from '../Api';
const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    income: '',
    status : 'Pending'
  });
  const [data,setData] = useState(null)
  const [allLoans,setAllLoans] = useState(null)
  const [total,setTotal] = useState(null)
  const [approved,setApproved] = useState(null)
  const [rejected,setRejected] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  const handleNewLoanApplication = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    try {
        const resp = await applyLoan(formData)
        console.log(resp?.data?.message)
        alert(resp?.data?.message)
        getData()
        setShowForm(false);
        setFormData({ amount: '', purpose: '', income: '',status : 'Pending' });
    }catch(error) {
        console.log(error)
        alert(error?.response?.data?.message || 'Error while applying loan');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ amount: '', purpose: '', income: '',status : 'Pending' });
  };

  const onStatusChange = async(id,status) => {
    try {
        const resp = await updateLoanStatus(id,status)
        alert(resp?.data?.message)
        getData()
    }catch(error) {
        console.log(error)
        alert(error?.response?.data?.message || 'Error while updating loan status');
    }
  }

  const getData = useCallback(async () => {
    try {
        if(user?.role === 'Admin') {
            const resp = await getAllLoans()
            setAllLoans(resp?.data?.loans)
            setTotal(resp?.data?.total)
            setApproved(resp?.data?.approved)
            setRejected(resp?.data?.rejected)
        }else {
            const resp = await getUserLoans();
            const loansArray = resp?.data?.loans || [];
            console.log(loansArray);
            setData(loansArray);
        }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    getData()
  },[getData])

  return (
    <div className="d-flex flex-column vh-100">
      <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
        <h1 className="h4 m-0">Fintech Microloan Approval System</h1>
        <div className='d-flex flex-row align-items-center justify-content-center gap-2'>
            <span>{user?.role}</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
            </button>

        </div>
      </header>
      {user?.role === 'Admin' ? (
        <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
             <div className="row w-100 mb-4">
    <div className="col-md-4">
      <div className="card text-white bg-primary mb-3">
        <div className="card-body text-center">
          <h5 className="card-title">Total Loans</h5>
          <p className="card-text fs-4">{total ?? 0}</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card text-white bg-success mb-3">
        <div className="card-body text-center">
          <h5 className="card-title">Approved</h5>
          <p className="card-text fs-4">{approved ?? 0}</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card text-white bg-danger mb-3">
        <div className="card-body text-center">
          <h5 className="card-title">Rejected</h5>
          <p className="card-text fs-4">{rejected ?? 0}</p>
        </div>
      </div>
    </div>
  </div>
            <div className="container mt-4">
                        <h4 className="mb-3">Loan Applications</h4>
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Income</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            { allLoans?.map((loan) => (
                                <tr key={loan._id}>
                                    <td>{loan.user?.name || "N/A"}</td>
                                    <td>{loan.amount}</td>
                                    <td>{loan.income}</td>
                                    <td>{loan.status}</td>
                                    <td>
                                    {loan.status === 'Pending' ? (
                                        <div className="btn-group">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => onStatusChange(loan._id, 'Approved')}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm ms-2"
                                            onClick={() => onStatusChange(loan._id, 'Rejected')}
                                        >
                                            Reject
                                        </button>
                                        </div>
                                    ) : (
                                        <span className="text-muted">No actions</span>
                                    )}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
        </main>
      ) : (
        <>
            {data?.length > 0 ? (
                <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    <div className="container mt-4">
                        <h4 className="mb-3">Loan Applications</h4>
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Income</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            { data.map((loan) => (
                                <tr key={loan._id}>
                                    <td>{loan.user?.name || "N/A"}</td>
                                    <td>{loan.amount}</td>
                                    <td>{loan.income}</td>
                                    <td>{loan.status}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                </main>
            ) : (
                <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    {!showForm ? (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleNewLoanApplication}
                    >
                        New Loan Application
                    </button>
                    ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 border rounded"
                        style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}
                    >
                        <div className="mb-3">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="form-control"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="1"
                        />
                        </div>

                        <div className="mb-3">
                        <label htmlFor="purpose" className="form-label">Purpose</label>
                        <input
                            type="text"
                            id="purpose"
                            name="purpose"
                            className="form-control"
                            value={formData.purpose}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className="mb-3">
                        <label htmlFor="income" className="form-label">Income</label>
                        <input
                            type="number"
                            id="income"
                            name="income"
                            className="form-control"
                            value={formData.income}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                        </div>

                        <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success">
                            Submit
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        </div>
                    </form>
                    )}
                </main>
            )}
        </>
      )}
      <footer className="bg-light text-center p-3">
        <small>© 2025 Fintech Microloan Approval System</small>
      </footer>
    </div>
  );
};

export default Home;