#!/usr/bin/env bash
#
# Waits until request to given URI returns 200 or timeout threshold is reached.
# Can be given a command to run when done waiting.
#
SCRIPT_NAME=${0##*/}

echoerr() { if [[ $QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage()
{
    cat << USAGE >&2
Usage:
    $SCRIPT_NAME uri [-s] [-t timeout] [-- COMMAND ARGS]
    uri                         a valid http(s) URI
    -s | --strict               Only execute COMMAND if the test succeeds
    -q | --quiet                Don't output any status messages
    -c | --code                 Expected HTTP status code
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Command with args to run after the test finishes
USAGE
    exit 1
}

wait_for()
{
    if [[ $TIMEOUT -gt 0 ]]; then
        echoerr "$SCRIPT_NAME: waiting $TIMEOUT seconds for $URI to get a $EXPECTEDCODE HTTP code"
    else
        echoerr "$SCRIPT_NAME: waiting for $URI without a timeout"
    fi
    WAIT_START_TS=$(date +%s)
    while :
    do
            STATUS_CODE=$(curl --connect-timeout 2 --insecure -s -o /dev/null -w ''%{http_code}'' $URI)
            test "$STATUS_CODE" == "$EXPECTEDCODE"
            OUTCOME=$?
        if [[ $OUTCOME -eq 0 ]]; then
            WAIT_END_TS=$(date +%s)
            echoerr "$SCRIPT_NAME: $URI is alive after $((WAIT_END_TS - WAIT_START_TS)) seconds"
            break
        fi
        sleep 1
    done
    return $OUTCOME
}

# passes this script and its arguments to timeout (the script calls itself inside a timeout context)
wait_for_wrapper()
{
    # In order to support SIGINT during timeout: http://unix.stackexchange.com/a/57692
    if [[ $QUIET -eq 1 ]]; then
        timeout $BUSY_BOX_TIMEFLAG $TIMEOUT $0 $URI --quiet --child --timeout=$TIMEOUT --code=$EXPECTEDCODE &
    else
        timeout $BUSY_BOX_TIMEFLAG $TIMEOUT $0 $URI --child --timeout=$TIMEOUT --code=$EXPECTEDCODE &
    fi
    SUBPROCESS_PID=$!
    trap "kill -INT -$SUBPROCESS_PID" INT
    wait $SUBPROCESS_PID
    OUTCOME=$?
    if [[ $OUTCOME -ne 0 ]]; then
        echoerr "$SCRIPT_NAME: timeout occurred after waiting $TIMEOUT seconds for $URI"
    fi
    return $OUTCOME
}

validate_uri()
{
    curl --connect-timeout 1 --insecure -s -o /dev/null $URI
    curl_exit_code=$?
    if [[ $curl_exit_code -eq 3 ]]; then # exit code 3 indicates an invalid URI
        echoerr "Error: you need to provide a VALID URI to test."
        usage
    fi
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        http://*)
        URI="$1"
        if [[ $URI == "" ]]; then break; fi
        shift 1
        ;;
        https://*)
        URI="$1"
        if [[ $URI == "" ]]; then break; fi
        shift 1
        ;;
        --child)
        CHILD=1
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        -s | --strict)
        STRICT=1
        shift 1
        ;;
        -c)
        EXPECTEDCODE="$2"
        if [[ $EXPECTEDCODE == "" ]]; then break; fi
        shift 2
        ;;
        --code=*)
        EXPECTEDCODE="${1#*=}"
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [[ $TIMEOUT == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        COMMAND=("$@")
        break
        ;;
        -h)
        usage
        ;;
        --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

# make sure that uri was given and is valid (by testing for curl exit code 3)
if [[ "$URI" == "" ]]; then
    echoerr "Error: you need to provide a URI to test."
    usage
fi
validate_uri

TIMEOUT=${TIMEOUT:-60}
STRICT=${STRICT:-0}
EXPECTEDCODE=${EXPECTEDCODE:-200}
CHILD=${CHILD:-0}
QUIET=${QUIET:-0}

# Check to see if timeout is from busybox?
TIMEOUT_PATH=$(type -p timeout)
TIMEOUT_PATH=$(realpath $TIMEOUT_PATH 2>/dev/null || readlink -f $TIMEOUT_PATH)

BUSY_BOX_TIMEFLAG=""
if [[ $TIMEOUT_PATH =~ "busybox" ]]; then
    ON_BUSY_BOX=1
    # Check if busybox timeout uses -t flag
    # (recent Alpine versions don't support -t anymore)
    if timeout &>/dev/stdout | grep -q -e '-t '; then
        BUSY_BOX_TIMEFLAG="-t"
    fi
else
    ON_BUSY_BOX=0
fi

if [[ $CHILD -gt 0 ]]; then
    wait_for
    OUTCOME=$?
    exit $OUTCOME
else
    if [[ $TIMEOUT -gt 0 ]]; then
        wait_for_wrapper
        OUTCOME=$?
    else
        wait_for
        OUTCOME=$?
    fi
fi

if [[ $COMMAND != "" ]]; then
    if [[ $OUTCOME -ne 0 && $STRICT -eq 1 ]]; then
        echoerr "$SCRIPT_NAME: strict mode, refusing to execute subprocess"
        exit $OUTCOME
    fi
    exec "${COMMAND[@]}"
else
    exit $OUTCOME
fi