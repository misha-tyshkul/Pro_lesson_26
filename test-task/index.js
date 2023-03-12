import { getUserByName, getUserInfractions } from "./user-api.js";

const replaceUrlWithLink = (reason) => {
  return reason.replace(/\bhttps:\/\/\S+/, (match) => `<a href="${match}">${match}</a>`);
};

const getMostRecentInfraction = (infractions) => {
  let foundIndex = 0;
  for (let i = 1; i < infractions.length; i++) {
    if (infractions[i].id > infractions[foundIndex].id) {
      foundIndex = i;
    }
  }
  return infractions[foundIndex];
};

const getWorstInfraction = (infractions) => {
  let foundIndex = 0;
  for (let i = 1; i < infractions.length; i++) {
    if (infractions[i].points > infractions[foundIndex].points) {
      foundIndex = i;
    }
  }
  return infractions[foundIndex];
};

const getInfractionReasonLinkified = (username, infractionSelector, callback) => {
  getUserByName(username, (user) => {
    getUserInfractions(user.id, (result) => {
      const selectedInfraction = infractionSelector(result);
      const linkifiedReason = replaceUrlWithLink(selectedInfraction.reason);
      callback(linkifiedReason);
    });
  });
};

export const getRelevantInfractionReasons = (username) => {
  return new Promise((resolve) => {
    const mostRecentSelector = (infractions) => getMostRecentInfraction(infractions);
    const worstSelector = (infractions) => getWorstInfraction(infractions);

    getInfractionReasonLinkified(username, mostRecentSelector, (mostRecent) => {
      getInfractionReasonLinkified(username, worstSelector, (worst) => {
        resolve({ mostRecent, worst });
      });
    });
  });
};
