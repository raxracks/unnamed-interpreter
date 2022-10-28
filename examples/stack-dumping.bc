push 1
push 2
push 3
push 4
push 5

jmp start

label print_stacks
    jmp print_current_stack
    jmp print_dumped_stack
    ret

label print_current_stack
    print "current stack:\n"
    print getstack
    print "\n\n"
    ret

label print_dumped_stack
    print "dumped stack:\n"
    print getsym stack
    print "\n\n"
    ret

label start
    jmp print_current_stack

    dumps stack
    print "stack dumped\n"
    clears
    print "stack cleared\n\n"

    jmp print_stacks

    res stack
    print "dumped stack restored\n"

    jmp print_current_stack

    exit 0