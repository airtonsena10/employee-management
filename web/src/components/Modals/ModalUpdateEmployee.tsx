import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { useForm, SubmitHandler } from "react-hook-form";
import { Iemployees } from "@/Iemployees";
import { ToggleLeft } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { UserRectangle } from "@phosphor-icons/react";
import axios from "axios";

import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ModalConfirmUpdate from "./ModalConfirmUpdate";
import Image from "next/image";

type Props = {
  openModal: boolean;
  handleOpen: Function;
  handleCloseModal: Function;
  action: string;
  employeeID: string | undefined;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const initialemployeeState: Iemployees = {
  id: "",
  ContactInfo: {
    name: "",
    lastName: "",
    email: "",
    gender: "",
    address: {
      cep: "",
      logradouro: "",
      number: 0,
      uf: "",
    },
    phone: "",
    profilePicture: "",
    birthday: new Date(),
  },
  employeeInfo: {
    role: "",
    admissioDate: new Date(),
    sector: "",
    salary: 0,
  },
  employeePDF: "",
  histories: { user: "" },
};

export default function ModalUpdateemployee({
  openModal,
  handleOpen,
  handleCloseModal,
  action,
  employeeID,
}: Props) {
  const [employee, setemployee] = useState<Iemployees>(initialemployeeState);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Iemployees>();

  const handleGetemployeeById = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_KEY}/${employeeID}`
      );
      const data = response.data;
      setemployee(data.employees);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetemployeeById();
  }, []);
  useEffect(() => {
    if (employee) {
      setValue("ContactInfo.name", employee.ContactInfo.name);
      setValue("ContactInfo.lastName", employee.ContactInfo.lastName);
      setValue("ContactInfo.address.cep", employee.ContactInfo.address.cep);
      setValue(
        "ContactInfo.address.number",
        employee.ContactInfo.address.number
      );
      setValue("ContactInfo.address.uf", employee.ContactInfo.address.uf);
      setValue(
        "ContactInfo.address.logradouro",
        employee.ContactInfo.address.logradouro
      );
      setValue("ContactInfo.phone", employee.ContactInfo.phone);
      setValue("ContactInfo.email", employee.ContactInfo.email);
      setValue("ContactInfo.gender", employee.ContactInfo.gender);
      setValue("ContactInfo.birthday", employee.ContactInfo.birthday);
      setValue("employeeInfo.role", employee.employeeInfo.role);
      setValue("employeeInfo.sector", employee.employeeInfo.sector);
      setValue("employeeInfo.salary", employee.employeeInfo.salary);
    }
  }, [employee]);

  const onSubmit: SubmitHandler<Iemployees> = (employeeData: Iemployees) => {
    setemployee(employeeData);
    // uploadImage()
    handleOpenConfirm();
  };

  const updateemployee = async (employeeData: Iemployees, id: string) => {
    try {
      const response = await axios.patch<Iemployees>(
        `${process.env.NEXT_PUBLIC_API_KEY}/${id}`,
        employeeData
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  //  imagem
  const [isRounded, setIsRounded] = useState<boolean>(false);
  const handleRounded = () => {
    setIsRounded((prev) => !prev);
  };

  // modal
  const [open, setOpen] = React.useState(false);
  const handleOpenConfirm = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={openModal}
      onClose={() => handleCloseModal()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* ATUALIZAR */}
        {action == "atualizar" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-full gap-5"
          >
            <div className="flex flex-col md:flex-row md:gap-5 w-full">
              <div className="flex flex-col lg:gap-5 lg:w-1/2">
                <div className="w-full flex flex-col">
                  <div className="flex flex-col w-full">
                    <label>Nome:</label>
                    <input
                      defaultValue={employee?.ContactInfo?.name}
                      {...register("ContactInfo.name", { required: true })}
                      type="text"
                      className="input"
                      placeholder="Nome"
                    />
                    {errors.ContactInfo?.name && (
                      <span className="text-red-500 text-xs">
                        Nome é obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">ex: Tiago</p>
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex flex-col w-full">
                    <label>Sobrenome:</label>
                    <input
                      defaultValue={employee?.ContactInfo?.lastName}
                      {...register("ContactInfo.lastName", { required: true })}
                      type="text"
                      className="input"
                      placeholder="Sobrenome"
                    />
                    {errors.ContactInfo?.lastName && (
                      <span className="text-red-500 text-xs">
                        Sobrenome é obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">ex: Souza</p>
                </div>
              </div>

              {/* FOTO DE PERFIL */}
              <div className="flex flex-col md:flex-row justify-center  lg:gap-3 lg:w-1/2">
                <div
                  className={`h-full flex justify-center items-center  rounded-md`}
                >
                  {employee?.ContactInfo?.profilePicture ? (
                    <div className="flex flex-col gap-3">
                      {typeof employee?.ContactInfo?.profilePicture ==
                        "string" && (
                        <Image
                          width={1000}
                          height={1000}
                          src={employee?.ContactInfo?.profilePicture}
                          alt="Selected"
                          className={`h-40 w-40 object-cover ${
                            isRounded ? "rounded-full" : ""
                          }`}
                        />
                      )}
                      <div className="flex items-center gap-3">
                        {isRounded ? (
                          <ToggleLeft
                            onClick={handleRounded}
                            className="text-3xl text-primaryColor cursor-pointer rotate-180"
                          />
                        ) : (
                          <BsToggle2Off
                            onClick={handleRounded}
                            className="text-3xl text-gray-400 cursor-pointer"
                          />
                        )}
                        <p className="text-sm">Foto Redonda</p>
                      </div>
                    </div>
                  ) : (
                    <UserRectangle className="text-gray-300 text-6xl" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <div className="flex flex-col w-full">
                    <label>CEP:</label>
                    <input
                      defaultValue={employee?.ContactInfo?.address?.cep}
                      {...register("ContactInfo.address.cep", {
                        required: true,
                      })}
                      type="text"
                      className="input w-full"
                      placeholder="CEP"
                    />
                    {errors.ContactInfo?.address?.cep && (
                      <span className="text-red-500 text-xs">
                        CEP é obrigatório
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col w-full">
                      <label>Número:</label>
                      <input
                        defaultValue={employee?.ContactInfo?.address?.number}
                        {...register("ContactInfo.address.number", {
                          required: true,
                          valueAsNumber: true,
                        })}
                        type="text"
                        className="input w-full"
                        placeholder="Número"
                      />
                      {errors.ContactInfo?.address?.number && (
                        <span className="text-red-500 text-xs">
                          Número é obrigatório
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col w-full">
                      <label>UF:</label>
                      <input
                        defaultValue={employee?.ContactInfo?.address?.uf}
                        {...register("ContactInfo.address.uf", {
                          required: true,
                        })}
                        type="text"
                        className="input w-full"
                        placeholder="UF"
                      />
                      {errors.ContactInfo?.address?.uf && (
                        <span className="text-red-500 text-xs">
                          UF é obrigatório
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label>Logradouro:</label>
                  <input
                    defaultValue={employee?.ContactInfo?.address?.logradouro}
                    {...register("ContactInfo.address.logradouro", {
                      required: true,
                    })}
                    type="text"
                    className="input"
                    placeholder="Logradouro"
                  />
                  {errors.ContactInfo?.address?.logradouro && (
                    <span className="text-red-500 text-xs">
                      Logadouro é obrigatório
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  ex: Rua 5 de Gotham City
                </p>
              </div>

              <div className="flex flex-col justify-center w-full gap-3">
                <div className="flex flex-col gap-3">
                  <div className="w-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="flex flex-col w-full">
                        <label>Telefone:</label>
                        <input
                          defaultValue={employee?.ContactInfo?.phone}
                          {...register("ContactInfo.phone", { required: true })}
                          type="text"
                          className="input w-full"
                          placeholder="Telefone"
                        />
                        {errors.ContactInfo?.phone && (
                          <span className="text-red-500 text-xs">
                            Telefone é obrigatório
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col w-full">
                        <label>Email:</label>
                        <input
                          defaultValue={employee?.ContactInfo?.email}
                          {...register("ContactInfo.email", { required: true })}
                          type="email"
                          className="input w-full"
                          placeholder="Email"
                        />
                        {errors.ContactInfo?.email && (
                          <span className="text-red-500 text-xs">
                            Email é obrigatório
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col w-full">
                        <label>Gênero:</label>
                        <select
                          value={employee?.ContactInfo?.gender}
                          {...register("ContactInfo.gender", {
                            required: true,
                          })}
                          className="input w-full"
                          placeholder="Gênero"
                        >
                          <option value="">-- Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option defaultValue="feminino">Feminino</option>
                        </select>
                        {errors.ContactInfo?.gender && (
                          <span className="text-red-500 text-xs">
                            Gênero é obrigatório
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">ex: Souza</p>
                  </div>
                  <div className="w-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="flex flex-col w-full">
                        <label>Data de Nascimento:</label>
                        <input
                          {...register("ContactInfo.birthday", {
                            required: true,
                          })}
                          type="date"
                          className="input w-full"
                          placeholder="Data de Nascimento"
                        />
                        {errors.ContactInfo?.birthday && (
                          <span className="text-red-500 text-xs">
                            Data de Nascimento é obrigatório
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">ex: Souza</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="outlined"
              onClick={handleOpenConfirm}
            >
              Salvar
            </Button>
          </form>
        )}

        {/* PROMOVER */}
        {action == "promover" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-full gap-5"
          >
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col justify-center w-full gap-3">
                <div className="w-full flex flex-col">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex flex-col w-full">
                      <label>Cargo:</label>
                      <input
                        defaultValue={employee?.employeeInfo?.role}
                        {...register("employeeInfo.role", { required: true })}
                        type="text"
                        className={`input value={employee.ContactInfo}  `}
                        placeholder="Cargo"
                      />
                      {errors.employeeInfo?.role && (
                        <span className="text-red-500 text-xs">
                          Cargo é obrigatório
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col w-full">
                      <label>Setor:</label>
                      <input
                        defaultValue={employee?.employeeInfo?.sector}
                        {...register("employeeInfo.sector", { required: true })}
                        type="text"
                        className="input value={employee.ContactInfo} w-full"
                        placeholder="Setor"
                      />
                      {errors.employeeInfo?.sector && (
                        <span className="text-red-500 text-xs">
                          Setor é obrigatório
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col w-full">
                      <label>Salário:</label>
                      <input
                        defaultValue={employee?.employeeInfo?.salary}
                        {...register("employeeInfo.salary", {
                          required: true,
                          valueAsNumber: true,
                        })}
                        type="text"
                        className="input w-full"
                        placeholder="Salário"
                      />
                      {errors.employeeInfo?.salary && (
                        <span className="text-red-500 text-xs">
                          Salário é obrigatório
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">ex: Coordenador</p>
                </div>
              </div>
            </div>

            <Button type="submit" variant="outlined">
              Salvar
            </Button>
          </form>
        )}
        {!Object.keys(errors).length &&
          open &&
          typeof employeeID == "string" && (
            <ModalConfirmUpdate
              employeeID={employeeID}
              employee={employee}
              updateemployee={updateemployee}
              handleClose={handleClose}
              handleOpen={handleOpenConfirm}
              open={open}
            />
          )}
      </Box>
    </Modal>
  );
}
