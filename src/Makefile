LIBS := epl2
epl2_SOURCES = epl2_pre Epl2Printer Epl2Html epl2_post

.PHONY: all

all: $(addsuffix .js, $(LIBS))

%.min.js: %.js
	cp $< $@

epl2.js: $(addsuffix .js, $(epl2_SOURCES))
	cat $^ > $@
