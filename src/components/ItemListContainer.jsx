import React, { useEffect, useState } from 'react';
import { ItemList } from './ItemList';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const ItemListContainer = () => {
  
  let { categoryId } = useParams();
  let [ productos, setProductos ] = useState([]);
  let [ titulo, setTitulo ] = useState('Productos');

  useEffect(() => {

    const prodsRef = collection(db, "productos");
    const qCatFilter = categoryId ? query(prodsRef, where("categoria.id", "==", categoryId)) : prodsRef;

    const catsRef = collection(db, "categorias");
    let qCats = categoryId && query(catsRef, where("id", "==", categoryId));

    getDocs(qCatFilter)
      .then((res) => {
        setProductos(
          res.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
          })
        )
      })

    if (qCats) {
      getDocs(qCats)
        .then((res) => {
          setTitulo(res.docs[0].data().nombre);
        })
    } else {
      setTitulo("Productos");
    }

  }, [categoryId]);

  return (
    <div className="items-list-container">
      <h1 className="display-4 fw-normal pb-3">{titulo}</h1>
      <div className="container">
        <div className="row">
            <ItemList productos={productos} />
        </div>
      </div>
    </div>
  )
  
}
