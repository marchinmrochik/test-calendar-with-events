import {Button, Select} from "../../styles";
import React from "react";
import styled from "styled-components";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {updateCountryCode} from "../../store/reducers/countriesCodeReducer";
import { Event, Labels } from "./components"
import {CountryCode} from "../../services/types";

const NavigationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  padding: 8px;
  margin-right: 8px;
`;

export const PanelContainer = () => {
    const dispatch = useAppDispatch();
    const { countryCode, countriesCode } = useAppSelector((state) => state.countriesCode);

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(updateCountryCode(event.target.value))
    };

    return (
         <>
             <NavigationBar>
                 <div>
                     <Select value={countryCode!} onChange={handleCountryChange}>
                         {countriesCode.map((item: CountryCode) => <option
                             value={item.countryCode}> {item.name} </option>)
                         }
                     </Select>
                     <Event/>
                     <Labels/>
                     <Button>Export</Button>
                     <Button>Download</Button>
                 </div>
                 <div>
                     <SearchInput type="text" placeholder="Search"/>
                 </div>
             </NavigationBar>
         </>
     )
}
