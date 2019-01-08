TOOL=docker-compose -f docker-compose.yml run --rm --name user-tool app node user-tool.js
help:
	@echo "**** Please ensure your environment is configured correctly ****"
	@echo "get-profiles             - returns all profiles"
	@echo "staging-get-profiles     - returns all profiles from staging"
	@echo
	@echo "get-profile              - returns a profile, uses PROFILE_ID, e.g."
	@echo "                           PROFILE_ID=mm9ip8tv make staging-get-profile"
	@echo "staging-get-profile      - returns a profile from staging."
	@echo
	@echo "get-orcid                - returns an orcid, uses ORCID_ID, e.g."
	@echo "                           ORCID_ID=mm9ip8tv make staging-get-orcid"
	@echo "staging-get-orcid        - returns a orcid from staging."


get-profiles:
	 ${TOOL}

staging-get-profiles:
	${TOOL} -s

get-profile:
	 ${TOOL} get-profile ${PROFILE_ID}

staging-get-profile:
	${TOOL} -s get-profile ${PROFILE_ID}

get-orcid:
	 ${TOOL} get-orcid ${ORCID_ID}

staging-get-orcid:
	${TOOL} -s get-orcid ${ORCID_ID}
