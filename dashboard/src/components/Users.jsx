import React, { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import Header from "./Header";

import avatar from "../assets/avatar.jpg";

import {
  deleteUser,
  fetchAllUsers,
} from "../store/slices/adminSlice";

const Users = () => {
  const dispatch = useDispatch();

  const { loading, users, totalUsers } = useSelector(
    (state) => state.admin
  );

  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [maxPage, setMaxPage] = useState(1);

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
  });

  // fetch users
  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  // max pages
  useEffect(() => {
    const pages = Math.ceil(totalUsers / 10);

    setMaxPage(pages || 1);
  }, [totalUsers]);

  // prevent invalid page
  useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, maxPage]);

  // delete user
  const handleDeleteUser = async (id) => {
  await dispatch(deleteUser(id, page));

  setDeleteConfirm({
    open: false,
    id: null,
  });
};

  // search filter
  const filteredUsers = useMemo(() => {
    return users?.filter(
      (user) =>
        user?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <main className="flex-1 min-h-screen bg-[#F7FCFC]">
      <Header />

      <section className="p-4 sm:p-6 lg:p-8">
        {/* top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              All Users
            </h1>

            <p className="text-slate-500 mt-2">
              Manage all PharmaAssist customers and monitor
              registered accounts.
            </p>
          </div>

          {/* search */}
          <div className="relative w-full lg:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full bg-white border border-teal-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-teal-500 shadow-sm"
            />
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-3xl border border-teal-100 p-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center">
              <UsersIcon className="w-7 h-7 text-teal-600" />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mt-5">
              {totalUsers || 0}
            </h2>

            <p className="text-slate-500 mt-1">
              Registered Users
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-6 text-white shadow-lg">
            <h2 className="text-4xl font-bold">
              {page}
            </h2>

            <p className="mt-2 opacity-90">
              Current Page
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-teal-100 p-6 shadow-sm">
            <h2 className="text-4xl font-bold text-slate-800">
              {maxPage}
            </h2>

            <p className="text-slate-500 mt-2">
              Total Pages
            </p>
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-3xl border border-teal-100 overflow-hidden shadow-sm">
          {/* loading */}
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className="py-24 text-center">
              <UsersIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />

              <h2 className="text-2xl font-bold text-slate-700">
                No Users Found
              </h2>

              <p className="text-slate-500 mt-2">
                Users matching your search will appear
                here.
              </p>
            </div>
          ) : (
            <>
              {/* desktop table */}
              <div className="overflow-x-auto hidden lg:block">
                <table className="w-full">
                  <thead className="bg-[#F4FBFB] border-b border-slate-100">
                    <tr>
                      <th className="text-left px-6 py-5 text-slate-600 font-semibold">
                        User
                      </th>

                      <th className="text-left px-6 py-5 text-slate-600 font-semibold">
                        Email
                      </th>

                      <th className="text-left px-6 py-5 text-slate-600 font-semibold">
                        Registered
                      </th>

                      <th className="text-center px-6 py-5 text-slate-600 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-100 hover:bg-[#F8FCFC] transition-all"
                      >
                        {/* user */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                user?.avatar?.url || avatar
                              }
                              alt={user.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                            />

                            <div>
                              <h3 className="font-bold text-slate-700">
                                {user.name}
                              </h3>

                              <p className="text-sm text-slate-500">
                                Customer Account
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* email */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4 text-teal-600" />

                            <span>{user.email}</span>
                          </div>
                        </td>

                        {/* created */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <CalendarDays className="w-4 h-4 text-teal-600" />

                            <span>
                              {new Date(
                                user.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  open: true,
                                  id: user._id,
                                })
                              }
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />

                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* mobile cards */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredUsers?.map((user) => (
                  <div
                    key={user._id}
                    className="border border-slate-100 rounded-3xl p-5 bg-[#FBFEFE]"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          user?.avatar?.url || avatar
                        }
                        alt={user.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-slate-700 text-lg">
                          {user.name}
                        </h3>

                        <p className="text-slate-500 text-sm mt-1 break-all">
                          {user.email}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                          <CalendarDays className="w-4 h-4 text-teal-600" />

                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          open: true,
                          id: user._id,
                        })
                      }
                      className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all"
                    >
                      <Trash2 className="w-4 h-4" />

                      Delete User
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* pagination */}
        {!loading && filteredUsers?.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="w-12 h-12 rounded-2xl bg-white border border-teal-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg">
              {page} / {maxPage}
            </div>

            <button
              disabled={page === maxPage}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="w-12 h-12 rounded-2xl bg-white border border-teal-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        )}
      </section>

      {/* DELETE MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mt-5">
              Delete User?
            </h2>

            <p className="text-slate-500 text-center mt-3">
              This action cannot be undone. The user account
              will be permanently removed.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() =>
                  setDeleteConfirm({
                    open: false,
                    id: null,
                  })
                }
                className="py-3 rounded-2xl border border-slate-200 font-semibold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>

              <button
  onClick={() => handleDeleteUser(deleteConfirm.id)}
  className="py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
>
  Delete
</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;