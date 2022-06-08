import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGroup, removeGroupStore } from '../feature/userGroupsSlice';
import {
  getGroups,
  addGroup,
  deleteGroup,
  getMembers,
  getAllMembers,
  addGroupMember,
} from '../services/GroupApi';
import {
  addMember,
  removeMemberStore,
  reloadMemberStore,
} from '../feature/groupMembersSlice';
import { addAllMembers } from '../feature/allMembersSlice';
import _ from 'lodash';

export default function UseGroups() {
  const dispatch = useDispatch();
  const groupsData = useSelector((state) => state.userGroups);
  const membersData = useSelector((state) => state.groupMembers);
  const allMembersData = useSelector((state) => state.allMembers);

  /*  Groups  */
  const loadGroupsData = async (userId, data) => {
    const eachGroupCode = [];
    for (let i = 0; i < data.length; i++) {
      eachGroupCode[i] = data[i].groupeCode;
    }
    return getGroups(userId, eachGroupCode).then((res) => {
      if (res?.data?.userGroups) {
        let i = 0;
        do {
          dispatch(setGroup(res.data.userGroups[i]));
          i++;
        } while (i < res.data.userGroups.length);
      }
      if (res?.data?.membresData) {
        const data = res.data.membresData.sort(function (a, b) {
          return a.groupeCode.toString().localeCompare(b.groupeCode.toString());
        });
        const sortedMember = _.groupBy(data, 'groupeCode');
        dispatch(addAllMembers(sortedMember));
      }
    });
  };

  const findGroup = async (code) => {
    for (let i = 0; i < groupsData.length; i++) {
      if (groupsData[i].codeGroupe === code) {
        return await groupsData[i];
      }
    }
    return;
  };

  const createGroup = async (id, data) => {
    return await addGroup(id, data);
  };

  const removeGroup = async (id, code) => {
    return await deleteGroup(id, code).then((res) => {
      if (!res.err) {
        dispatch(removeGroupStore(res.data.data.codeGroupe));
      }
    });
  };

  /*  Members  */
  const loadAllMembers = async (id, data) => {
    let finalData = [];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        finalData.push(data[i].codeGroupe);
      }
      return await getAllMembers(id, finalData).then((res) => {
        console.log(res);
        if (!res.err) {
          for (let i = 0; i < finalData.length; i++) {
            for (let j = 0; j < res.data.members.length; j++) {
              if (res.data.members[j].groupeCode === finalData[i]) {
                // dispatch(addAllMembers(res.data.members[j]));
              }
            }
          }
          return;
        }
      });
    }
    return;
  };

  const findMember = async (id, code) => {
    return await getMembers(id, code).then((res) => {
      if (res.data.members) {
        let i = 0;
        do {
          dispatch(addMember(res.data.members[i]));
          i++;
        } while (i < res.data.members.length);
      }
    });
  };

  const addMemberToGroup = async (id, codeGroup) => {
    return await addGroupMember(id, codeGroup).then((res) => {
      console.log(res);
      if (!res.err) {
        // dispatch(res);
      }
    });
  };

  const removeMember = () => {
    return dispatch(removeMemberStore(0));
  };

  const reloadMember = (id, code) => {
    dispatch(removeMemberStore(0));
    setTimeout(async () => {
      return await getMembers(id, code).then((res) => {
        if (res.data.members) {
          let i = 0;
          do {
            dispatch(addMember(res.data.members[i]));
            i++;
          } while (i < res.data.members.length);
        }
      });
    }, 500);
  };

  return {
    groupsData,
    loadGroupsData,
    findGroup,
    findMember,
    membersData,
    createGroup,
    removeGroup,
    removeMember,
    loadAllMembers,
    allMembersData,
    addMemberToGroup,
    reloadMember,
  };
}