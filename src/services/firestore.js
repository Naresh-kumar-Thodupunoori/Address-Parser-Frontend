import { collection, addDoc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

const saveAddressHistory = async (historyItem) => {
  try {
    const docRef = await addDoc(collection(db, "addressHistory"), historyItem);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getAddressHistory = async () => {
  const querySnapshot = await getDocs(collection(db, "addressHistory"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteAllAddressHistory = async () => {
  const querySnapshot = await getDocs(collection(db, "addressHistory"));
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

export { saveAddressHistory, getAddressHistory, deleteAllAddressHistory };