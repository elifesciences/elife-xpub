# Development Process

The process is a very light-weight one and is here to help guide how you
approach developing code for this project. In general the principles are:

1. Collaborate
2. Reuse
3. Test, Test, Test

## Design

No matter the size of the change you should have a clear view of what needs to
be done and now to do it. If not _talk to people_ (point 1). Consider using
something someone else has created before (point 2), but temper this with
not using small or immature libraries from npm.

Refer to the [Server-Side](server-side.md) and [Client-Side](client-side.md)
principles to ensure you are not contravening these. The bigger the impact the
more people you need to talk to.

## Test

Testing is the first consideration after you now know what you are doing and
how you are doing it. Ask yourself "How am I going to test this?". Refer to
the [Testing Strategy](../testing/strategy.md) to help guide you as to what and
how you are going to test the new features.

## Test & Develop

Your development should always be accompanied by developing tests, write the
tests first where possible and then code to make them go green.

Testing can also include asking members of the Product/UX team to comment on
what you are doing.

## Finally

Point 1 - talk to people as frequently as you need to. If you find yourself
struggling alone then ask.

Point 2 - look to write code in a way that can be reused and look to find work
that has already been done before.

Point 3 - test often, test appropriately and fail fast!
