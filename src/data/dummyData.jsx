import { v4 as uuidv4 } from 'uuid';

const generateDummyData = () => {
  const employees = [
    { id: uuidv4(), name: 'Blessing Gomba', employeeId: 'OMN5432', department: 'Projects', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Chipo Musonda', employeeId: 'OMN5921', department: 'Finance', subsidiary: 'Bulawayo', status: 'Active' },
    { id: uuidv4(), name: 'Farai Makoni', employeeId: 'OMN5683', department: 'Inbound', subsidiary: 'Masvingo', status: 'Active' },
    { id: uuidv4(), name: 'Ishe Dube', employeeId: 'OMN7026', department: 'Business Dev', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Kudakwashe Zvinowanda', employeeId: 'OMN1375', department: 'HR', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Makanaka Mutombodzi', employeeId: 'OMN7654', department: 'Outbound', subsidiary: 'Masvingo', status: 'Active' },
    { id: uuidv4(), name: 'Makomborero Dube', employeeId: 'OMN5533', department: 'SHE', subsidiary: 'Bulawayo', status: 'Active' },
    { id: uuidv4(), name: 'Nyasha Chikanga', employeeId: 'OMN8742', department: 'I.S', subsidiary: 'Bulawayo', status: 'Active' },
    { id: uuidv4(), name: 'Pardon Hove', employeeId: 'OMN7896', department: 'Marketing', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Ropafadzo Chifamba', employeeId: 'OMN2345', department: 'Projects', subsidiary: 'Masvingo', status: 'Active' },
    { id: uuidv4(), name: 'Rudo Juru', employeeId: 'OMN8127', department: 'Business Dev', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Rungano Mutare', employeeId: 'OMN8901', department: 'Outbound', subsidiary: 'Bulawayo', status: 'Active' },
    { id: uuidv4(), name: 'Shingai Muronzi', employeeId: 'OMN1122', department: 'Finance', subsidiary: 'Masvingo', status: 'Active' },
    { id: uuidv4(), name: 'Simbarashe Gora', employeeId: 'OMN9654', department: 'SHE', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Tafadzwa Ndlovu', employeeId: 'OMN3409', department: 'HR', subsidiary: 'Harare', status: 'Active' },
    { id: uuidv4(), name: 'Takudzwa Mudzingwa', employeeId: 'OMN1324', department: 'Marketing', subsidiary: 'Bulawayo', status: 'Active' },
    { id: uuidv4(), name: 'Tarisai Nyamugure', employeeId: 'OMN9843', department: 'Inbound', subsidiary: 'Masvingo', status: 'Active' },
    { id: uuidv4(), name: 'Tendai Moyo', employeeId: 'OMN1253', department: 'I.S', subsidiary: 'Masvingo', status: 'Active' },
    { id: uuidv4(), name: 'Tinotenda Mavhunga', employeeId: 'OMN1234', department: 'Business Dev', subsidiary: 'Bulawayo', status: 'Active' },
    { id: uuidv4(), name: 'Vanessa Nyathi', employeeId: 'OMN4298', department: 'HR', subsidiary: 'Harare', status: 'Active' },
  ];

  const blacklistEntries = [
    {
      id: uuidv4(),
      employeeId: 'OMN5432',
      employeeName: 'Blessing Gomba',
      reason: 'Gross Misconduct',
      date: new Date(2023, 10, 15).toISOString(),
      subsidiary: 'Harare',
      status: 'Active'
    },
    {
      id: uuidv4(),
      employeeId: 'OMN7654',
      employeeName: 'Makanaka Mutombodzi',
      reason: 'Fraud',
      date: new Date(2024, 0, 20).toISOString(),
      subsidiary: 'Masvingo',
      status: 'Active'
    },
    {
      id: uuidv4(),
      employeeId: 'OMN5683',
      employeeName: 'Farai Makoni',
      reason: 'Policy Violation',
      date: new Date(2023, 7, 1).toISOString(),
      subsidiary: 'Masvingo',
      status: 'Active'
    },
    {
      id: uuidv4(),
      employeeId: 'OMN1375',
      employeeName: 'Kudakwashe Zvinowanda',
      reason: 'Theft',
      date: new Date(2024, 4, 10).toISOString(),
      subsidiary: 'Harare',
      status: 'Active'
    },
    {
      id: uuidv4(),
      employeeId: 'OMN5921',
      employeeName: 'Chipo Musonda',
      reason: 'Repeated Absences',
      date: new Date(2023, 11, 5).toISOString(),
      subsidiary: 'Bulawayo',
      status: 'Revoked'
    },
  ];

  return { employees, blacklistEntries };
};

export default generateDummyData;
