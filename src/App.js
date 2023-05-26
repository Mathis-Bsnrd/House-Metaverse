import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Geometry, Base, Subtraction, Addition } from "@react-three/csg";
import { Environment } from "./Environment";
import "./App.css";
import Web3 from "web3";
import HouseNFT from "./build/contracts/HouseNFT.json";
import Modal from "react-modal";

const box = new THREE.BoxGeometry();
const cyl = new THREE.CylinderGeometry(1, 1, 2, 20);
const tri = new THREE.CylinderGeometry(1, 1, 2, 3);

Modal.setAppElement("#root");

export default function App() {
  const web3 = new Web3(window.ethereum);
  const contractInterface = HouseNFT.abi;
  const contractAddress = "0x16Ee620be2B13a321Af3CDbEb9Ce70Ca481549d4";
  const contractInstance = new web3.eth.Contract(
    contractInterface,
    contractAddress
  );

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [cost, setCost] = useState(0); // Coût d'une maison
  const [houses, setHouses] = useState([
    { owner: null, position: [0, 0, 0] },
    { owner: null, position: [5, 0, 0] },
    { owner: null, position: [0, 0, 5] },
    { owner: null, position: [5, 0, 5] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHouseOwner, setSelectedHouseOwner] = useState("");

  const connectWallet = async () => {
    try {
      // Demande l'autorisation de se connecter
      await window.ethereum.enable();

      // Récupère l'adresse du compte connecté
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];

      setIsWalletConnected(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyHouse = async (index) => {
    try {
      if (houses[index].owner) {
        return;
      }

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];

      const result = await contractInstance.methods
        .mint()
        .send({ from: address, value: cost, gas: 500000 });

      const owner = address;

      setHouses((prevHouses) => {
        const updatedHouses = [...prevHouses];
        updatedHouses[index] = { owner };
        return updatedHouses;
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    connectWallet();

    contractInstance.methods
      .cost()
      .call()
      .then((result) => {
        setCost(result);
      });
  }, []);

  const handleMouseEnter = (owner) => {
    if (owner && owner == "0x16Ee620be2B13a321Af3CDbEb9Ce70Ca481549d4") {
      setSelectedHouseOwner(owner);
      setIsModalOpen(true);
    }
  };

  return (
    <div id="canvas-container">
      {isWalletConnected ? (
        <Canvas shadows camera={{ position: [-15, 10, 15], fov: 25 }}>
          <color attach="background" args={["skyblue"]} />
          {houses.map((house, index) => (
            <House
              key={index}
              owner={house.owner}
              onClick={() => handleBuyHouse(index)}
              position={house.position}
              onMouseEnter={() => handleMouseEnter(house.owner)}
            />
          ))}

          <Environment />
          <OrbitControls makeDefault />
        </Canvas>
      ) : (
        <div className="connect-wallet">
          Connectez votre wallet pour afficher le contenu
        </div>
      )}

      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Propriétaire de la maison"
        className="custom-modal"
      >
        <h2>Propriétaire de la maison</h2>
        <p>{selectedHouseOwner}</p>
      </Modal> */}
    </div>
  );
}

function House(props) {
  const csg = useRef();
  const { owner } = props;

  let materialColor = "white";

  if (owner) {
    if (owner === "0x16Ee620be2B13a321Af3CDbEb9Ce70Ca481549d4") {
      materialColor = "green"; // Votre maison (propriétaire)
    } else {
      materialColor = "red"; // Maison achetée par quelqu'un d'autre
    }
  }

  return (
    <mesh
      onClick={props.onClick}
      receiveShadow
      castShadow
      position={props.position}
      onPointerEnter={props.onMouseEnter}
    >
      <Geometry ref={csg} computeVertexNormals>
        <Base name="base" geometry={box} scale={[3, 3, 3]} />
        <Subtraction name="cavity" geometry={box} scale={[2.7, 2.7, 2.7]} />
        <Addition
          name="roof"
          geometry={tri}
          scale={[2.5, 1.5, 1.425]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 2.2, 0]}
        />
      </Geometry>
      <meshStandardMaterial color={materialColor} envMapIntensity={0.25} />
    </mesh>
  );
}

const Door = (props) => (
  <Subtraction {...props}>
    <Geometry>
      <Base geometry={box} scale={[1, 2, 1]} />
      <Addition
        geometry={cyl}
        scale={0.5}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 1, 0]}
      />
    </Geometry>
  </Subtraction>
);

const Window = (props) => (
  <Subtraction {...props}>
    <Geometry>
      <Base geometry={box} />
      <Subtraction geometry={box} scale={[0.05, 1, 1]} />
      <Subtraction geometry={box} scale={[1, 0.05, 1]} />
    </Geometry>
  </Subtraction>
);

const Chimney = (props) => (
  <Addition name="chimney" {...props}>
    <Geometry>
      <Base name="base" geometry={box} scale={[1, 2, 1]} />
      <Subtraction
        name="hole"
        geometry={box}
        scale={[0.7, 2, 0.7]}
        position={[0, 0.5, 0]}
      />
    </Geometry>
  </Addition>
);
