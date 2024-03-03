import React, { useEffect, useState } from "react";
import "./Tableview.css";

export function Tableview() {
  const [gets, setGets] = useState([]);

  const [currPageNo, setPageNo] = useState(1);

  const [filter, setFilter] = useState("none");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(true);
 
  let pageSize = 20;
  let nPages = 3;

  useEffect(() => {
    let result = fetch("http://localhost:5000/getUsers")
      .then((response) => response.json())
      .then((data) => {
        setGets(data);
      });
  }, []);

  const pageNext = () => {
    if (currPageNo < nPages) setPageNo(currPageNo + 1);
  };

  const pagePrev = () => {
    if (currPageNo > 1) setPageNo(currPageNo - 1);
  };

  function filteredArray(arrx) {
    let arr = arrx;
    
    if (search != "") {
        arr = arr.filter((user)=> searchType ? user.customer_name.toLowerCase().includes(search) : user.location.toLowerCase().includes(search));
    }
    
    nPages = (arr.length % 20)

    if (filter == "none") return arr;
    else if (filter == "sortD") {
      let g = arr.toSorted((bef, af) => {
        let a = new Date(bef.created_at.substring(0, 10));
        console.log(a);
        let b = new Date(af.created_at.substring(0, 10));
        return a > b ? 1 : a == b ? 0 : -1;
      });
      nPages = (g.length % 20) + 1
      return g;
    }
    else if (filter == "sortT") {
      let g = arr.toSorted((bef, af) => {
        let a = new Date(bef.created_at);
        let b = new Date(af.created_at);
        a.setUTCFullYear(2004, 0, 1);
        b.setUTCFullYear(2004, 0, 1);
        return a > b ? 1 : a == b ? 0 : -1;
      });
      nPages = (g.length % 20) + 1
      return g;
    }
  }

  return (
    <>
      <div>
        <table>
          <tr className="headerc">
            <th> S. No. </th>
            <th> Customer Name </th>
            <th> Age </th>
            <th> Phone </th>
            <th> Location </th>
            <th> Date Added </th>
            <th> Time Added </th>
          </tr>
          {filteredArray(gets)
            .slice((currPageNo - 1) * 20, currPageNo * 20)
            .map((user) => {
              return (
                <tr>
                  <td>{user.sno}</td>
                  <td>{user.customer_name}</td>
                  <td>{user.age}</td>
                  <td>{user.phone}</td>
                  <td>{user.location}</td>
                  <td>{user.created_at.substring(0, 10)}</td>
                  <td>{user.created_at.substring(11, 19)}</td>
                </tr>
              );
            })}
        </table>
        <p>Page <span className="pageno">{currPageNo}</span></p>
        <button onClick={pagePrev}>Prev</button>
        <button onClick={pageNext}>Next</button>
        <button
          onClick={() => {
            if (filter != "sortD") setFilter("sortD");
            else setFilter("none");

            setPageNo(1)
          }}
        >
          Sort Date
        </button>
        <button
          onClick={() => {
            if (filter != "sortT") setFilter("sortT");
            else setFilter("none");

            setPageNo(1)
          }}
        >
          Sort Time
        </button>
        <input type="text" id="searchbox"></input>
        <button onClick={()=>{
            setSearchType(true);
            setSearch(document.getElementById('searchbox').value.toLowerCase().trim())
            setPageNo(1);
        }}>Search Name</button>
        <button onClick={()=>{
            setSearchType(false);
            setSearch(document.getElementById('searchbox').value.toLowerCase().trim())
            setPageNo(1);
        }}>Search Location</button>
        <button onClick={()=>{
            setPageNo(1);
            setFilter("none");
            setSearch("");
            document.getElementById('searchbox').value = "";
            setSearchType(true);
        }}>Reset</button>
      </div>
    </>
  );
}
