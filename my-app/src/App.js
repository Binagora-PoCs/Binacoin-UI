import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Routes, Route } from "react-router-dom";
import AddBinagorian from "./components/add-binagorian.component";
import BinagorianProfile from "./components/binagorian-profile.component";
import Binagorians from "./components/binagorians.component";
class App extends Component {
  render() {
    return (
      <div>
        <Grid
          templateAreas={`"header header"
                          "nav main"
                          "nav footer"`}
          gridTemplateRows={'100px 1fr 30px'}
          gridTemplateColumns={'150px 1fr'}
          h='200px'
          gap='1'
          color='blackAlpha.700'
          fontWeight='bold'
        >
          <GridItem pl='2' bg='orange.300' area={'header'}>
            <BinagorianProfile/>
          </GridItem>
          <GridItem pl='2' bg='pink.300' area={'nav'}>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href='/binagorians'>Binagorians</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href='/add'>Add</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </GridItem>
          <GridItem pl='2' bg='green.300' area={'main'}>
            <Box borderRadius='md' w='100%' p={4} color='white'>
              <Routes>
                <Route path="/add" element={<AddBinagorian/>} />
                <Route path="/binagorians" element={<Binagorians/>} />
              </Routes>
            </Box>
          </GridItem>
          <GridItem pl='2' bg='blue.300' area={'footer'}>
            Footer
          </GridItem>
        </Grid>
      </div>
    );
  }
}
export default App;