.PHONY: all serve

all: serve

serve:
	ng serve & \
	./pocketbase/pocketbase serve & \
	wait